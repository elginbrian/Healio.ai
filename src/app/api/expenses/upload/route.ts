import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import Receipt from "@/models/receipt";
import ExpenseRecord from "@/models/expense-record";
import { ReceiptStatus, ExpenseCategory } from "@/types";
import { processReceiptWithGemini, ParsedReceiptData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  let userObjectId: mongoose.Types.ObjectId;
  let originalFileName: string = "unknown_receipt.jpg";

  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }
    userObjectId = new mongoose.Types.ObjectId(userId);

    const formData = await request.formData();
    const receiptImage = formData.get("receiptImage") as File;
    console.log("FormData processed, receiptImage retrieved:", !!receiptImage);

    if (!receiptImage) {
      console.error("No receiptImage found in formData.");
      return NextResponse.json({ success: false, message: "File struk tidak ditemukan." }, { status: 400 });
    }
    originalFileName = receiptImage.name;

    if (!receiptImage.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Hanya file gambar yang diperbolehkan." }, { status: 400 });
    }
    if (receiptImage.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Ukuran file terlalu besar. Maksimal 5MB." }, { status: 400 });
    }

    const arrayBuffer = await receiptImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("Image buffer created.");

    const newReceipt = new Receipt({
      user_id: userObjectId,
      image_url: `processed_direct_to_gemini/${originalFileName}`,
      status: ReceiptStatus.PENDING, //
      upload_date: new Date(),
    });
    await newReceipt.save();
    console.log("Receipt database entry created:", newReceipt._id);

    let extractedData: ParsedReceiptData | null = null;
    let createdExpenseRecords = [];

    try {
      extractedData = await processReceiptWithGemini(buffer, receiptImage.type); //
      console.log("Receipt processed with Gemini:", extractedData);

      if (!extractedData || !extractedData.items || extractedData.items.length === 0) {
        newReceipt.status = ReceiptStatus.FAILED; //
        newReceipt.processing_error = "Tidak dapat mengekstrak data dari struk.";
        await newReceipt.save();
        console.warn("Failed to extract data from receipt via Gemini.");
        return NextResponse.json({ success: false, message: "Tidak dapat mengekstrak data dari struk. Coba lagi dengan gambar yang lebih jelas." }, { status: 422 });
      }

      const transactionDate = extractedData.transactionDate ? new Date(extractedData.transactionDate) : new Date(); //

      const expensePromises = extractedData.items.map(async (item) => {
        const expenseRecord = new ExpenseRecord({
          receipt_id: newReceipt._id,
          user_id: userObjectId,
          category: item.category || ExpenseCategory.OTHER,
          medicine_name: item.medicine_name,
          total_price: item.total_price,
          transaction_date: transactionDate,
          facility_name: extractedData?.facilityName,
        });
        return expenseRecord.save();
      });

      createdExpenseRecords = await Promise.all(expensePromises);
      console.log(`${createdExpenseRecords.length} expense records created.`);

      newReceipt.status = ReceiptStatus.PROCESSED;
      newReceipt.ocr_raw_text = JSON.stringify(extractedData);
      await newReceipt.save();
      console.log("Receipt status updated to PROCESSED.");

      return NextResponse.json(
        {
          success: true,
          message: "Struk berhasil diproses dan data pengeluaran berhasil disimpan.",
          receipt: {
            _id: newReceipt._id,
            image_url: newReceipt.image_url,
            status: newReceipt.status,
          },
          expenses: createdExpenseRecords.map((record: any) => ({
            _id: record._id,
            medicine_name: record.medicine_name,
            total_price: record.total_price,
            category: record.category,
            transaction_date: record.transaction_date,
          })),
        },
        { status: 201 }
      );
    } catch (aiError: any) {
      console.error("RECEIPT_PROCESSING_ERROR (during AI/Gemini step):", aiError);
      console.error("AI Error Name:", aiError.name);
      console.error("AI Error Message:", aiError.message);
      console.error("AI Error Stack:", aiError.stack);

      newReceipt.status = ReceiptStatus.FAILED;
      newReceipt.processing_error = `Gagal memproses struk: ${aiError.message || "Kesalahan tidak diketahui."}`;
      await newReceipt.save();
      return NextResponse.json({ success: false, message: "Gagal memproses struk. Coba lagi nanti atau gunakan gambar yang lebih jelas." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("EXPENSE_UPLOAD_ERROR --- DETAILED ---:", error);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    if (error.name === "MongoNetworkError" || error.message.includes("connect ECONNREFUSED")) {
      return NextResponse.json({ success: false, message: "Kesalahan koneksi ke database. Silakan coba beberapa saat lagi." }, { status: 503 });
    }
    if (error.code === "EACCES" || error.code === "EPERM") {
      return NextResponse.json({ success: false, message: "Kesalahan izin tulis pada server. Hubungi administrator sistem." }, { status: 500 });
    }
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, message: `Data yang dikirim tidak valid: ${error.message}` }, { status: 422 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengunggah struk." }, { status: 500 });
  }
}
