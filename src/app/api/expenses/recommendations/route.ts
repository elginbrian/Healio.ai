import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import ExpenseRecord from "@/models/expense-record";
import { generateSpendingRecommendations } from "@/lib/gemini";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentExpenses = await ExpenseRecord.find({
      user_id: userObjectId,
      transaction_date: { $gte: threeMonthsAgo },
    })
      .sort({ transaction_date: -1 })
      .limit(100)
      .lean();

    const spendingByCategory = await ExpenseRecord.aggregate([
      {
        $match: {
          user_id: userObjectId,
          transaction_date: { $gte: threeMonthsAgo },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$total_price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalSpending = spendingByCategory.reduce((sum, cat) => sum + cat.total, 0);

    const recommendations = await generateSpendingRecommendations(recentExpenses, recentExpenses.length);

    return NextResponse.json(
      {
        success: true,
        recommendations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EXPENSE_RECOMMENDATION_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat mengambil rekomendasi." }, { status: 500 });
  }
}

