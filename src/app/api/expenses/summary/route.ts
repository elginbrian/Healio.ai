import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import { ExpenseCategory } from "@/types";
import ExpenseRecord from "@/models/expense-record";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "current_month";

    let startDate, endDate;
    const now = new Date();

    if (period === "current_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === "last_month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    }

    const matchQuery: any = { user_id: userObjectId };
    if (startDate && endDate) {
      matchQuery.transaction_date = { $gte: startDate, $lte: endDate };
    }

    const totalSpendingResult = await ExpenseRecord.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: "$total_price" },
        },
      },
    ]);
    const totalSpending = totalSpendingResult.length > 0 ? totalSpendingResult[0].total : 0;

    const spendingByCategoryResult = await ExpenseRecord.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$total_price" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const spendingByCategory = spendingByCategoryResult.map((item) => ({
      category: item._id as ExpenseCategory,
      total: item.total,
      count: item.count,
    }));


    return NextResponse.json(
      {
        success: true,
        summary: {
          totalSpending,
          period,
          spendingByCategory,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EXPENSE_SUMMARY_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

