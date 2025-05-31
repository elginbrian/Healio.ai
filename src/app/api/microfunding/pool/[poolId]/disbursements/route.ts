import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";
import Disbursement from "@/models/disbursement";
import { DisbursementStatus, PoolMemberRole } from "@/types";
import mongoose from "mongoose";

function calculateVotingDeadline(durationString: string): Date {
  const now = new Date();
  if (durationString.endsWith("_HOURS")) {
    const hours = parseInt(durationString.replace("_HOURS", ""), 10);
    if (!isNaN(hours)) {
      now.setHours(now.getHours() + hours);
      return now;
    }
  }
  now.setHours(now.getHours() + 24);
  return now;
}

export async function POST(request: NextRequest, { params }: { params: { poolId: string } }) {
  try {
    await connectToDatabase();
    const currentUserId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!currentUserId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const { poolId } = params;
    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const poolObjectId = new mongoose.Types.ObjectId(poolId);
    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    const pool = await MicrofundingPool.findById(poolObjectId);
    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
    }

    const member = await PoolMember.findOne({ pool_id: poolObjectId, user_id: userObjectId });
    if (!member) {
      return NextResponse.json({ success: false, message: "Anda bukan anggota pool ini." }, { status: 403 });
    }

    const { recipient_user_id, amount, purpose, proof_url } = await request.json();

    if (!recipient_user_id || !amount || !purpose) {
      return NextResponse.json({ success: false, message: "Penerima, jumlah, dan tujuan wajib diisi." }, { status: 400 });
    }
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, message: "Jumlah harus angka positif." }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(recipient_user_id)) {
      return NextResponse.json({ success: false, message: "Format ID Penerima tidak valid." }, { status: 400 });
    }
    if (amount > pool.current_amount) {
      return NextResponse.json({ success: false, message: "Dana pool tidak mencukupi untuk pengajuan ini." }, { status: 400 });
    }

    const votingDeadline = calculateVotingDeadline(pool.claim_voting_duration);

    const newDisbursement = new Disbursement({
      pool_id: poolObjectId,
      recipient_user_id: new mongoose.Types.ObjectId(recipient_user_id),
      requested_by_user_id: userObjectId,
      amount,
      purpose,
      proof_url: proof_url || undefined,
      status: DisbursementStatus.PENDING_VOTE,
      request_date: new Date(),
      voting_deadline: votingDeadline,
      votes_for: 0,
      votes_against: 0,
      voters: [],
    });

    await newDisbursement.save();

    return NextResponse.json({ success: true, message: "Permintaan pengeluaran dana berhasil dibuat dan masuk tahap voting.", disbursement: newDisbursement }, { status: 201 });
  } catch (error: any) {
    console.error("CREATE_DISBURSEMENT_REQUEST_ERROR:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { poolId: string } }) {
  try {
    await connectToDatabase();
    const currentUserId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!currentUserId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const { poolId } = params;
    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }
    const poolObjectId = new mongoose.Types.ObjectId(poolId);
    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    const member = await PoolMember.findOne({ pool_id: poolObjectId, user_id: userObjectId });
    if (!member) {
      return NextResponse.json({ success: false, message: "Anda bukan anggota pool ini untuk melihat pengeluaran." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "request_date";
    const sortOrder = searchParams.get("order") === "asc" ? 1 : -1;

    const query: any = { pool_id: poolObjectId };
    if (statusFilter && Object.values(DisbursementStatus).includes(statusFilter as DisbursementStatus)) {
      query.status = statusFilter;
    }

    const disbursements = await Disbursement.find(query)
      .populate("recipient_user_id", "name email")
      .populate("requested_by_user_id", "name email")
      .sort({ [sortBy]: sortOrder })
      .lean();

    return NextResponse.json({ success: true, disbursements }, { status: 200 });
  } catch (error: any) {
    console.error("GET_DISBURSEMENTS_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
