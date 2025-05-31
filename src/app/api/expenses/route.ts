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

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const sortBy = searchParams.get("sortBy") || "transaction_date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : null;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : null;
    const category = searchParams.get("category");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { user_id: userObjectId };

    if (startDate && endDate) {
      filter.$or = [
        { transaction_date: { $gte: startDate, $lte: endDate } },
        { $and: [{ transaction_date: { $exists: false } }, { createdAt: { $gte: startDate, $lte: endDate } }] },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const expenses = await ExpenseRecord.find(filter)
      .sort({ [sortBy]: sortDirection, _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await ExpenseRecord.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: expenses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EXPENSES_API_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data pengeluaran.",
      },
      { status: 500 }
    );
  }
}

