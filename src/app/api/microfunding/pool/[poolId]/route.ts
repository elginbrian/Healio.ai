import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import mongoose from "mongoose";
import { getUserIdFromToken } from "@/lib/auth-util";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";
import { PoolMemberRole } from "@/types";

export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    return MicrofundingPool.findById(poolId)
      .populate<{ creator_user_id: typeof User }>({
        path: "creator_user_id",
        select: "name email _id",
      })
      .lean()
      .then((pool) => {
        if (!pool) {
          return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
        }
        return NextResponse.json({ success: true, pool: pool }, { status: 200 });
      })
      .catch((error) => {
        console.error("GET_POOL_DETAIL_ERROR:", error);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil detail pool." }, { status: 500 });
      });
  } catch (error: any) {
    console.error("GET_POOL_DETAIL_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil detail pool." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const isAdmin = await PoolMember.findOne({
      pool_id: new mongoose.Types.ObjectId(poolId),
      user_id: new mongoose.Types.ObjectId(userId),
      role: PoolMemberRole.ADMIN,
    });

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak: Anda bukan admin pool ini.",
        },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Validate the update data
    const allowedFields = ["title", "description", "max_members", "contribution_amount_per_member", "benefit_coverage"];
    const filteredData = Object.keys(updateData)
      .filter((key) => allowedFields.includes(key))
      .reduce<Record<string, any>>((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data valid untuk diperbarui.",
        },
        { status: 400 }
      );
    }

    // Update the pool
    const updatedPool = await MicrofundingPool.findByIdAndUpdate(poolId, { $set: filteredData }, { new: true, runValidators: true });

    if (!updatedPool) {
      return NextResponse.json(
        {
          success: false,
          message: "Pool tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pool berhasil diperbarui.",
        pool: updatedPool,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE_POOL_ERROR:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat memperbarui pool.",
      },
      { status: 500 }
    );
  }
}
