// src/app/api/microfunding/join-requests/[requestId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import { PoolMemberRole, JoinRequestStatus } from "@/types/enums"; //
import mongoose from "mongoose";
import JoinRequest from "@/models/join-request"; //
import MicrofundingPool from "@/models/microfunding-pool"; //
import PoolMember from "@/models/pool-member"; //

export async function PATCH(request: NextRequest, { params }: { params: { requestId: string } }) {
  // params is not a Promise here based on Next.js 13+ app router
  try {
    await connectToDatabase(); //
    const { requestId } = params; // langsung destructure

    if (!requestId) {
      return NextResponse.json({ success: false, message: "Request ID tidak ditemukan dalam parameter." }, { status: 400 });
    }

    const adminUserId = getUserIdFromToken(request.headers.get("Authorization")); //
    if (!adminUserId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ success: false, message: "Format Request ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { status: newStatus } = body;

    if (!newStatus || !Object.values(JoinRequestStatus).includes(newStatus as JoinRequestStatus)) {
      return NextResponse.json({ success: false, message: "Status baru tidak valid." }, { status: 400 });
    }

    const joinRequestDoc = await JoinRequest.findById(requestId);

    if (!joinRequestDoc) {
      return NextResponse.json({ success: false, message: "Permintaan bergabung tidak ditemukan." }, { status: 404 });
    }

    if (joinRequestDoc.status !== JoinRequestStatus.PENDING) {
      return NextResponse.json({ success: false, message: "Permintaan ini sudah diproses sebelumnya." }, { status: 400 });
    }

    const pool = await MicrofundingPool.findById(joinRequestDoc.pool_id);
    if (!pool) {
      // Seharusnya tidak terjadi jika joinRequestDoc valid, tapi baik untuk defensive coding
      joinRequestDoc.status = JoinRequestStatus.REJECTED;
      joinRequestDoc.resolved_at = new Date().toISOString();
      joinRequestDoc.resolver_user_id = adminUserId as any;
      await joinRequestDoc.save();
      return NextResponse.json({ success: false, message: "Pool terkait tidak ditemukan. Permintaan ditolak otomatis." }, { status: 404 });
    }

    const adminMembership = await PoolMember.findOne({ pool_id: pool._id, user_id: adminUserId, role: PoolMemberRole.ADMIN });
    if (!adminMembership) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Anda bukan admin pool ini." }, { status: 403 });
    }

    if (newStatus === JoinRequestStatus.APPROVED) {
      const memberCount = await PoolMember.countDocuments({ pool_id: pool._id });
      if (memberCount >= pool.max_members) {
        joinRequestDoc.status = JoinRequestStatus.REJECTED;
        // Tambahkan alasan penolakan jika ada fieldnya di model
        // joinRequestDoc.rejection_reason = "Pool sudah penuh";
        joinRequestDoc.resolved_at = new Date().toISOString();
        joinRequestDoc.resolver_user_id = adminUserId as any;
        await joinRequestDoc.save();
        return NextResponse.json({ success: false, message: "Gagal menyetujui: Pool sudah penuh." }, { status: 400 });
      }

      const newMember = new PoolMember({
        pool_id: pool._id,
        user_id: joinRequestDoc.user_id,
        role: PoolMemberRole.MEMBER,
        joined_date: new Date().toISOString(),
      });

      try {
        await newMember.save();
        joinRequestDoc.status = JoinRequestStatus.APPROVED;
      } catch (memberSaveError: any) {
        console.error("Failed to save new member:", memberSaveError);
        // Jika gagal menyimpan anggota (misal, karena error duplikat jika ada race condition),
        // sebaiknya jangan tandai permintaan sebagai APPROVED.
        // Bisa ditolak atau biarkan PENDING dengan log error.
        // Untuk kasus ini, kita kembalikan error server.
        return NextResponse.json({ success: false, message: "Gagal menambahkan anggota baru ke pool. Silakan coba lagi." }, { status: 500 });
      }
    } else if (newStatus === JoinRequestStatus.REJECTED) {
      joinRequestDoc.status = JoinRequestStatus.REJECTED;
      // joinRequestDoc.rejection_reason = body.reason || "Ditolak oleh admin"; // Jika ingin menyimpan alasan
    }

    joinRequestDoc.resolved_at = new Date().toISOString();
    joinRequestDoc.resolver_user_id = adminUserId as any; //
    await joinRequestDoc.save();

    return NextResponse.json(
      {
        success: true,
        message: `Permintaan bergabung telah berhasil di-${newStatus === JoinRequestStatus.APPROVED ? "setujui" : "tolak"}.`,
        updatedRequest: joinRequestDoc,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE_JOIN_REQUEST_ERROR_ASYNC:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => (val as Error).message);
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 });
    }
    // Handle kasus spesifik jika user sudah menjadi member (meskipun idealnya dicegah di frontend/logika request)
    if (error.code === 11000 && error.message.includes("pool_id_1_user_id_1")) {
      // Error duplikat dari index unique di PoolMember schema
      // Bisa jadi joinRequestDoc sudah diproses atau ada race condition
      // Cek ulang status joinRequestDoc
      const currentJoinRequest = await JoinRequest.findById(params.requestId);
      if (currentJoinRequest && currentJoinRequest.status !== JoinRequestStatus.PENDING) {
        return NextResponse.json({ success: false, message: "Permintaan ini sudah diproses." }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: "Gagal menambahkan anggota: Kemungkinan anggota sudah ada atau terjadi konflik." }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server saat memperbarui permintaan." }, { status: 500 });
  }
}
