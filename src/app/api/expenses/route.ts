import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "transaction_date";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    const query: any = { user_id: userObjectId };

    if (category) {
      query.category = category;
    }
    if (startDate && endDate) {
      query.transaction_date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.transaction_date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.transaction_date = { $lte: new Date(endDate) };
    }

    const sortOptions: any = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder;
    } else {
      sortOptions["transaction_date"] = -1;
    }

    const expenses = await ExpenseRecord.find(query)
      .populate({ path: "receipt_id", select: "image_url upload_date status" })
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalExpenses = await ExpenseRecord.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: expenses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalExpenses / limit),
          totalExpenses,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET_EXPENSES_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

