import User from "@/models/user"; // Untuk populasi jika diperlukan
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import { IPoolMember } from "@/types";
import PoolMember from "@/models/pool-member";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";

interface Context {
  params: {
    poolId: string;
  };
}

// Define a new interface for populated PoolMember
interface IPoolMemberPopulated extends Omit<IPoolMember, "user_id"> {
  user_id: {
    _id: string;
    name?: string;
    email?: string;
  };
}

export async function GET(request: NextRequest, context: Context) {
  try {
    await connectToDatabase();
    const { poolId } = context.params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID atau User ID tidak valid." }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const poolObjectId = new mongoose.Types.ObjectId(poolId);

    // Use the new interface for populated data
    const membership = (await PoolMember.findOne({
      pool_id: poolObjectId,
      user_id: userObjectId,
    })
      .populate({
        path: "user_id",
        select: "name email",
      })
      .lean()) as IPoolMemberPopulated | null;

    if (!membership) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda bukan anggota dari pool ini.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        member: membership,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET_POOL_MEMBER_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat mengambil data keanggotaan.",
      },
      { status: 500 }
    );
  }
}
