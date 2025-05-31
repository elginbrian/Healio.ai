import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ExpenseRecord from "@/models/expense-record";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "current_month";

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    let periodLabel = "";

    switch (period) {
      case "current_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        periodLabel = "Bulan Ini";
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        periodLabel = "Bulan Lalu";
        break;
      case "last_3_months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        periodLabel = "3 Bulan Terakhir";
        break;
      case "year_to_date":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        periodLabel = "Tahun Ini";
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        periodLabel = "Bulan Ini";
    }

    // Query for calculating total spending
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const result = await ExpenseRecord.aggregate([
      {
        $match: {
          user_id: userObjectId,
          $or: [
            { transaction_date: { $gte: startDate, $lte: endDate } },
            // Also consider createdAt if transaction_date is not available
            { $and: [{ transaction_date: { $exists: false } }, { createdAt: { $gte: startDate, $lte: endDate } }] },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalSpending: { $sum: "$total_price" },
        },
      },
    ]);

    const totalSpending = result.length > 0 ? result[0].totalSpending : 0;

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalSpending,
          periodLabel,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EXPENSE_SUMMARY_API_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil ringkasan pengeluaran.",
      },
      { status: 500 }
    );
  }
}
