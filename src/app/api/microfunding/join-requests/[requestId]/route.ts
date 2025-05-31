// src/app/api/microfunding/join-requests/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import { PoolMemberRole, JoinRequestStatus } from "@/types/enums";
import JoinRequest from "@/models/join-request";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

// Definisikan tipe untuk body request
interface PatchRequestBody {
  status: JoinRequestStatus;
  reason?: string;
}

// ===================================================================
// PERBAIKAN UTAMA DI SINI: Definisikan tipe untuk konteks rute
// ===================================================================
interface RouteContext {
  params: {
    requestId: string;
  };
}

// Gunakan 'async' dan terapkan interface RouteContext yang baru
export async function PATCH(request: NextRequest, context: RouteContext) {
  // Ambil requestId dari context
  const { requestId } = context.params;

  // ... (Sisa kode Anda tetap sama persis)

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return NextResponse.json({ success: false, message: "Format Request ID tidak valid." }, { status: 400 });
  }

  const adminUserId = getUserIdFromToken(request.headers.get("Authorization"));
  if (!adminUserId) {
    return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
  }

  let body: PatchRequestBody;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, message: "Request body tidak valid (JSON)." }, { status: 400 });
  }

  const { status: newStatus } = body;
  if (!newStatus || !Object.values(JoinRequestStatus).includes(newStatus)) {
    return NextResponse.json({ success: false, message: "Status baru tidak valid." }, { status: 400 });
  }

  const session = await mongoose.startSession();
  try {
    let updatedRequest;
    await session.withTransaction(async () => {
      const joinRequestDoc = await JoinRequest.findById(requestId).session(session);
      if (!joinRequestDoc) throw new Error("NOT_FOUND");
      if (joinRequestDoc.status !== JoinRequestStatus.PENDING) throw new Error("ALREADY_PROCESSED");

      const pool = await MicrofundingPool.findById(joinRequestDoc.pool_id).session(session);
      if (!pool) throw new Error("POOL_NOT_FOUND");

      const adminMembership = await PoolMember.findOne({
        pool_id: pool._id,
        user_id: adminUserId,
        role: PoolMemberRole.ADMIN,
      }).session(session);
      if (!adminMembership) throw new Error("FORBIDDEN");

      if (newStatus === JoinRequestStatus.APPROVED) {
        const memberCount = await PoolMember.countDocuments({ pool_id: pool._id }).session(session);
        if (memberCount >= pool.max_members) throw new Error("POOL_FULL");

        const existingMember = await PoolMember.findOne({
          pool_id: pool._id,
          user_id: joinRequestDoc.user_id,
        }).session(session);
        if (existingMember) throw new Error("USER_ALREADY_MEMBER");

        const newMember = new PoolMember({
          pool_id: pool._id,
          user_id: joinRequestDoc.user_id,
          role: PoolMemberRole.MEMBER,
          joined_date: new Date(),
        });
        await newMember.save({ session });
      }

      joinRequestDoc.status = newStatus;
      joinRequestDoc.resolved_at = new Date();
      joinRequestDoc.resolver_user_id = new mongoose.Types.ObjectId(adminUserId);

      updatedRequest = await joinRequestDoc.save({ session });
    });

    return NextResponse.json(
      {
        success: true,
        message: `Permintaan bergabung telah berhasil di-${newStatus === JoinRequestStatus.APPROVED ? "setujui" : "tolak"}.`,
        updatedRequest,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH_JOIN_REQUEST_ERROR:", error);

    if (error.message === "NOT_FOUND") return NextResponse.json({ success: false, message: "Permintaan bergabung tidak ditemukan." }, { status: 404 });
    if (error.message === "ALREADY_PROCESSED") return NextResponse.json({ success: false, message: "Permintaan ini sudah diproses sebelumnya." }, { status: 409 });
    if (error.message === "POOL_NOT_FOUND") return NextResponse.json({ success: false, message: "Pool terkait tidak ditemukan. Terjadi inkonsistensi data." }, { status: 500 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "Akses ditolak: Anda bukan admin pool ini." }, { status: 403 });
    if (error.message === "POOL_FULL") return NextResponse.json({ success: false, message: "Gagal menyetujui: Pool sudah penuh." }, { status: 409 });
    if (error.message === "USER_ALREADY_MEMBER") return NextResponse.json({ success: false, message: "Gagal menyetujui: Pengguna ini sudah menjadi anggota pool." }, { status: 409 });
    if (error.code === 11000) return NextResponse.json({ success: false, message: "Gagal menambahkan anggota. Kemungkinan pengguna ini sudah menjadi anggota." }, { status: 409 });

    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
