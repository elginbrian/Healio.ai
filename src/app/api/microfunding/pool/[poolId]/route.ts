import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import mongoose from "mongoose";
import { getUserIdFromToken } from "@/lib/auth-util";
import MicrofundingPool from "@/models/microfunding-pool";

// Perubahan 1: Hapus interface 'Context' dan perbarui tanda tangan fungsi GET
export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    // Perubahan 2: Gunakan 'await' untuk mendapatkan 'poolId'
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const pool = await MicrofundingPool.findById(poolId)
      .populate<{ creator_user_id: typeof User }>({
        path: "creator_user_id",
        select: "name email _id",
      })
      .lean();

    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, pool: pool }, { status: 200 });
  } catch (error: any) {
    console.error("GET_POOL_DETAIL_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil detail pool." }, { status: 500 });
  }
}
