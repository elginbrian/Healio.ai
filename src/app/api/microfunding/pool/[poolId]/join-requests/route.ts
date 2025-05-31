// src/app/api/microfunding/pools/[poolId]/join-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import User from "@/models/user"; // Untuk populasi data user
import { PoolMemberRole, JoinRequestStatus } from "@/types/enums";
import mongoose from "mongoose";
import PoolMember from "@/models/pool-member";
import JoinRequest from "@/models/join-request";

interface Context {
  params: {
    poolId: string;
  };
}

export async function GET(request: NextRequest, context: Context) {
  try {
    await connectToDatabase();
    const { poolId } = context.params;

    const adminUserId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!adminUserId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    // Verifikasi apakah pengguna adalah admin dari pool ini
    const adminMembership = await PoolMember.findOne({ pool_id: poolId, user_id: adminUserId, role: PoolMemberRole.ADMIN });
    if (!adminMembership) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Anda bukan admin pool ini." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const query: any = { pool_id: poolId };
    if (statusFilter && Object.values(JoinRequestStatus).includes(statusFilter as JoinRequestStatus)) {
      query.status = statusFilter as JoinRequestStatus;
    } else {
      // Default ke PENDING jika tidak ada filter status atau filter tidak valid
      query.status = JoinRequestStatus.PENDING;
    }

    const requests = await JoinRequest.find(query)
      .populate<{ user_id: typeof User }>("user_id", "name email") // Ambil nama dan email user pemohon
      .sort({ requested_at: -1 }); // Urutkan berdasarkan tanggal permintaan terbaru

    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error: any) {
    console.error("GET_JOIN_REQUESTS_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat mengambil permintaan bergabung." }, { status: 500 });
  }
}
