import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import ExpenseRecord from "@/models/expense-record";
import { ExpenseCategory } from "@/types";

interface Recommendation {
  title: string;
  description: string;
  category?: ExpenseCategory;
  potentialSavings?: number;
  actionable: boolean;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get last 3 months expenses
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expenses = await ExpenseRecord.find({
      user_id: userObjectId,
      transaction_date: { $gte: threeMonthsAgo },
    }).sort({ transaction_date: -1 });

    if (expenses.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [
          {
            title: "Mulai catat pengeluaran kesehatan Anda",
            description: "Unggah struk pertama Anda untuk mulai melacak pengeluaran kesehatan dan dapatkan rekomendasi penghematan.",
            actionable: false,
          },
        ],
      });
    }

    // Calculate total by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      const category = expense.category;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += expense.total_price;
    });

    // Generate recommendations based on spending patterns
    const recommendations: Recommendation[] = [];

    // Check if medication expenses are high
    if (categoryTotals[ExpenseCategory.MEDICATION] > 500000) {
      recommendations.push({
        title: "Pertimbangkan obat generik",
        description: "Pengeluaran obat Anda cukup tinggi. Tanyakan pada dokter tentang alternatif obat generik yang lebih terjangkau.",
        category: ExpenseCategory.MEDICATION,
        potentialSavings: Math.round(categoryTotals[ExpenseCategory.MEDICATION] * 0.3),
        actionable: true,
      });
    }

    // Check for frequent consultations
    const consultationCount = expenses.filter((e) => e.category === ExpenseCategory.CONSULTATION).length;
    if (consultationCount > 5) {
      recommendations.push({
        title: "Periksa paket konsultasi bulanan",
        description: "Anda sering melakukan konsultasi. Beberapa fasilitas kesehatan menawarkan paket konsultasi bulanan yang lebih hemat.",
        category: ExpenseCategory.CONSULTATION,
        actionable: true,
      });
    }

    // Add generic recommendation if no specific ones
    if (recommendations.length === 0) {
      recommendations.push({
        title: "Pengeluaran kesehatan Anda terlihat baik",
        description: "Lanjutkan mencatat pengeluaran kesehatan secara rutin untuk mendapatkan rekomendasi penghematan.",
        actionable: false,
      });
    }

    return NextResponse.json(
      {
        success: true,
        recommendations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EXPENSE_RECOMMENDATIONS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat mengambil rekomendasi.",
      },
      { status: 500 }
    );
  }
}
