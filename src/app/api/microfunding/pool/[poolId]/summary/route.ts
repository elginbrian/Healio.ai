// src/app/api/microfunding/pools/[poolId]/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
// import Claim from "@/models/claim"; // Anda perlu model Claim jika ingin menghitung klaim yang disetujui
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

// Perubahan 1: Hapus interface 'Context' dan perbarui tanda tangan fungsi
export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    // Perubahan 2: Gunakan 'await' untuk mendapatkan 'poolId' dari params
    const { poolId } = await params;

    // Otentikasi mungkin tidak wajib untuk summary, tergantung kebutuhan
    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      // Jika summary bersifat publik, Anda bisa hapus cek otentikasi ini
      // return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const poolObjectId = new mongoose.Types.ObjectId(poolId);

    const pool = await MicrofundingPool.findById(poolObjectId).lean();
    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
    }

    const memberCount = await PoolMember.countDocuments({ pool_id: poolObjectId });

    // Untuk claimsApproved, Anda perlu model Claim dan logika untuk menghitungnya
    // Contoh dummy:
    const claimsApproved = Math.floor(Math.random() * memberCount); // Ganti dengan logika sebenarnya

    const summary = {
      memberCount: memberCount,
      totalFunds: pool.current_amount, // Ambil dari field current_amount di pool
      claimsApproved: claimsApproved, // Ganti dengan perhitungan aktual
    };

    return NextResponse.json({ success: true, summary: summary }, { status: 200 });
  } catch (error: any) {
    console.error("GET_POOL_SUMMARY_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil ringkasan pool." }, { status: 500 });
  }
}
