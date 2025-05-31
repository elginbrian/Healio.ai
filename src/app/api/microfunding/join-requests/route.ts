import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import User from "@/models/user";
import { JoinRequestStatus, PoolStatus } from "@/types/enums";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";
import JoinRequest from "@/models/join-request";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const body = await request.json();
    const { pool_code } = body;

    console.log("Join request initiated:", { user: userId, pool_code });

    if (!pool_code || typeof pool_code !== "string" || pool_code.trim() === "") {
      return NextResponse.json({ success: false, message: "Kode pool wajib diisi." }, { status: 400 });
    }

    const pool = await MicrofundingPool.findOne({ pool_code: pool_code.trim().toUpperCase() });
    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool dengan kode tersebut tidak ditemukan." }, { status: 404 });
    }

    console.log("Pool found:", { poolId: pool._id, poolCode: pool.pool_code });

    if (pool.status !== PoolStatus.OPEN) {
      return NextResponse.json({ success: false, message: "Pool ini tidak lagi menerima anggota baru." }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const poolObjectId = new mongoose.Types.ObjectId(pool._id);

    const existingMember = await PoolMember.findOne({
      pool_id: poolObjectId,
      user_id: userObjectId,
    });
    if (existingMember) {
      return NextResponse.json({ success: false, message: "Anda sudah menjadi anggota pool ini." }, { status: 409 });
    }

    const existingRequest = await JoinRequest.findOne({
      pool_id: poolObjectId,
      user_id: userObjectId,
      status: JoinRequestStatus.PENDING,
    });
    if (existingRequest) {
      return NextResponse.json({ success: false, message: "Anda sudah memiliki permintaan bergabung yang tertunda untuk pool ini." }, { status: 409 });
    }

    const memberCount = await PoolMember.countDocuments({ pool_id: poolObjectId });
    if (memberCount >= pool.max_members) {
      return NextResponse.json({ success: false, message: "Pool ini sudah mencapai jumlah anggota maksimal." }, { status: 400 });
    }

    const newJoinRequest = new JoinRequest({
      pool_id: poolObjectId,
      user_id: userObjectId,
      status: JoinRequestStatus.PENDING,
      requested_at: new Date().toISOString(),
    });

    await newJoinRequest.save();
    console.log("Join request created successfully:", { requestId: newJoinRequest._id });

    return NextResponse.json(
      {
        success: true,
        message: "Permintaan bergabung telah berhasil dikirim dan menunggu persetujuan admin.",
        joinRequest: {
          _id: (newJoinRequest._id as mongoose.Types.ObjectId).toString(),
          status: newJoinRequest.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("JOIN_REQUEST_ERROR:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat memproses permintaan." }, { status: 500 });
  }
}
