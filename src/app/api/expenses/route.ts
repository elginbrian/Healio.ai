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

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "transaction_date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    // Filtering parameters
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate") as string) : null;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : null;
    const category = searchParams.get("category");

    // Build filter object
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const filter: any = { user_id: userObjectId };

    // Add date filter if provided
    if (startDate && endDate) {
      filter.$or = [
        { transaction_date: { $gte: startDate, $lte: endDate } },
        // Also consider createdAt if transaction_date is not available
        { $and: [{ transaction_date: { $exists: false } }, { createdAt: { $gte: startDate, $lte: endDate } }] },
      ];
    }

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Execute the query
    const expenses = await ExpenseRecord.find(filter)
      .sort({ [sortBy]: sortDirection, _id: -1 }) // Secondary sort by _id to ensure consistent order
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
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
