import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import Receipt from "@/models/receipt";
import ExpenseRecord from "@/models/expense-record";
import { ReceiptStatus, ExpenseCategory } from "@/types";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs/promises";

// Type for parsed receipt data from OCR/AI
interface ParsedReceiptData {
  items: {
    name: string;
    quantity?: number;
    unit_price?: number;
    total_price: number;
    category?: ExpenseCategory;
  }[];
  facility_name?: string;
  transaction_date?: string;
  total_amount?: number;
}

// Function to process receipt with AI (mock implementation)
async function processReceiptWithGemini(filePath: string): Promise<ParsedReceiptData | null> {
  // This would be your actual AI implementation
  // For now, let's return mock data
  return {
    items: [
      {
        name: "PARACETAMOL TAB",
        quantity: 10,
        unit_price: 3000,
        total_price: 30000,
        category: ExpenseCategory.MEDICATION,
      },
    ],
    facility_name: "Apotek Sehat",
    transaction_date: new Date().toISOString(),
    total_amount: 30000,
  };
}

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

    // Create a new receipt document
    const newReceipt = new Receipt({
      user_id: userObjectId,
      image_url: publicImageUrl,
      status: ReceiptStatus.PENDING,
      upload_date: new Date(),
    });
    await newReceipt.save();

    let extractedData: ParsedReceiptData | null = null;
    let createdExpenseRecords = [];

    try {
      // Process the receipt image with AI
      extractedData = await processReceiptWithGemini(filePath);

      if (!extractedData || !extractedData.items || extractedData.items.length === 0) {
        newReceipt.status = ReceiptStatus.FAILED;
        newReceipt.processing_error = "Tidak dapat mengekstrak data dari struk.";
        await newReceipt.save();
        return NextResponse.json({ success: false, message: "Tidak dapat mengekstrak data dari struk. Coba lagi dengan gambar yang lebih jelas." }, { status: 422 });
      }

      // Create expense records from extracted data
      const transactionDate = extractedData.transaction_date ? new Date(extractedData.transaction_date) : new Date();

      const expensePromises = extractedData.items.map(async (item) => {
        const expenseRecord = new ExpenseRecord({
          receipt_id: newReceipt._id,
          user_id: userObjectId,
          category: item.category || ExpenseCategory.MEDICATION,
          medicine_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          transaction_date: transactionDate,
          facility_name: extractedData?.facility_name,
        });
        return expenseRecord.save();
      });

      createdExpenseRecords = await Promise.all(expensePromises);

      // Update receipt status to processed
      newReceipt.status = ReceiptStatus.PROCESSED;
      newReceipt.ocr_raw_text = JSON.stringify(extractedData);
      await newReceipt.save();

      return NextResponse.json(
        {
          success: true,
          message: "Struk berhasil diproses dan data pengeluaran berhasil disimpan.",
          receipt: {
            _id: newReceipt._id,
            image_url: newReceipt.image_url,
            status: newReceipt.status,
          },
          expenses: createdExpenseRecords.map((record) => ({
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
      console.error("RECEIPT_PROCESSING_ERROR:", aiError);
      newReceipt.status = ReceiptStatus.FAILED;
      newReceipt.processing_error = `Gagal memproses struk: ${aiError.message || "Kesalahan tidak diketahui."}`;
      await newReceipt.save();
      return NextResponse.json({ success: false, message: "Gagal memproses struk. Coba lagi nanti atau gunakan gambar yang lebih jelas." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("EXPENSE_UPLOAD_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengunggah struk." }, { status: 500 });
  }
}
