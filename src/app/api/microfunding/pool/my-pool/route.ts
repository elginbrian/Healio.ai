import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import { IMicrofundingPool, IUser } from "@/types";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

interface IMicrofundingPoolPopulated extends Omit<IMicrofundingPool, "creator_user_id"> {
  creator_user_id: Pick<IUser, "_id" | "name" | "email">;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const memberOfPools = await PoolMember.find({ user_id: userObjectId }).select("pool_id").lean();
    const memberOfPoolIds = memberOfPools.map((member) => member.pool_id);

    const createdPools = await MicrofundingPool.find({ creator_user_id: userObjectId }).select("_id").lean();
    const createdPoolIds = createdPools.map((pool) => pool._id);

    const allRelevantPoolIds = Array.from(new Set([...memberOfPoolIds, ...createdPoolIds].map((id) => id.toString()))).map((idStr) => new mongoose.Types.ObjectId(idStr));

    if (allRelevantPoolIds.length === 0) {
      return NextResponse.json({ success: true, pools: [] }, { status: 200 });
    }

    const pools = await MicrofundingPool.find({
      _id: { $in: allRelevantPoolIds },
    })
      .populate<{ creator_user_id: Pick<IUser, "name" | "email" | "_id"> }>({
        path: "creator_user_id",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .lean();

    const poolsForResponse = pools.map((pool) => {
      const { creator_user_id, ...poolData } = pool;

      return {
        ...poolData,
        creator_user_id: creator_user_id._id,
        creator_name: creator_user_id.name,
        creator_email: creator_user_id.email,
      };
    });

    return NextResponse.json({ success: true, pools: poolsForResponse }, { status: 200 });
  } catch (error: any) {
    console.error("GET_MY_POOLS_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil daftar pool Anda." }, { status: 500 });
  }
}

