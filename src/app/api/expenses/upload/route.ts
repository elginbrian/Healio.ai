import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import { ReceiptStatus, ExpenseCategory } from "@/types";
import { processReceiptWithGemini, ParsedReceiptData } from "@/lib/gemini";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import ExpenseRecord from "@/models/expense-record";
import Receipt from "@/models/receipt";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "receipts");

const ensureUploadDirExists = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await ensureUploadDirExists();

    const formData = await request.formData();
    const receiptImage = formData.get("receiptImage") as File;

    if (!receiptImage) {
      return NextResponse.json({ success: false, message: "File struk tidak ditemukan." }, { status: 400 });
    }

    if (!receiptImage.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Hanya file gambar yang diperbolehkan." }, { status: 400 });
    }

    if (receiptImage.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Ukuran file terlalu besar. Maksimal 5MB." }, { status: 400 });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = receiptImage.name.split(".").pop() || "jpg";
    const fileName = `receipt-${uniqueSuffix}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const publicImageUrl = `/uploads/receipts/${fileName}`;

    const arrayBuffer = await receiptImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(filePath, buffer);

    const newReceipt = new Receipt({
      user_id: userObjectId,
      image_url: publicImageUrl,
      status: ReceiptStatus.PENDING,
      upload_date: new Date(),
    });
    await newReceipt.save();

    let extractedData: ParsedReceiptData | null = null;
    try {
      extractedData = await processReceiptWithGemini(filePath);

      if (!extractedData || !extractedData.items || extractedData.items.length === 0) {
        newReceipt.status = ReceiptStatus.FAILED;
        newReceipt.processing_error = "AI tidak dapat mengekstrak item dari struk.";
        await newReceipt.save();
        return NextResponse.json({ success: false, message: "AI tidak dapat mengekstrak item dari struk." }, { status: 400 });
      }

      const expenseRecordDocs = extractedData.items.map((item) => ({
        receipt_id: newReceipt._id,
        user_id: userObjectId,
        transaction_date: extractedData?.transactionDate ? new Date(extractedData.transactionDate) : newReceipt.upload_date,
        facility_name: extractedData?.facilityName,
        category: item.category || ExpenseCategory.OTHER,
        medicine_name: item.medicine_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      await ExpenseRecord.insertMany(expenseRecordDocs);

      newReceipt.status = ReceiptStatus.PROCESSED;
      await newReceipt.save();

      return NextResponse.json(
        {
          success: true,
          message: "Struk berhasil diunggah dan diproses.",
          receipt: newReceipt,
          expenses: expenseRecordDocs,
        },
        { status: 201 }
      );
    } catch (aiError: any) {
      console.error("Error processing with AI:", aiError);
      newReceipt.status = ReceiptStatus.FAILED;
      newReceipt.processing_error = aiError.message || "Gagal memproses struk dengan AI.";
      await newReceipt.save();
      return NextResponse.json({ success: false, message: `Gagal memproses struk: ${aiError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error("EXPENSE_UPLOAD_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengunggah struk." }, { status: 500 });
  }
}
