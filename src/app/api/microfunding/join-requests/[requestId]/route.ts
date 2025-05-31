import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import { PoolMemberRole, JoinRequestStatus } from "@/types/enums";
import mongoose from "mongoose";
import JoinRequest from "@/models/join-request";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

// The dynamic part of your route is assumed to be [requestId]
// e.g., /api/some-route/[requestId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> } // 1. FIX: Update the type for params
) {
  try {
    await connectToDatabase();
    const { requestId } = await params;

    if (!requestId) {
      return NextResponse.json({ success: false, message: "Request ID tidak ditemukan dalam parameter." }, { status: 400 });
    }

    const adminUserId = getUserIdFromToken(request.headers.get("Authorization"));
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
      return NextResponse.json({ success: false, message: "Pool terkait tidak ditemukan." }, { status: 404 });
    }

    const adminMembership = await PoolMember.findOne({ pool_id: pool._id, user_id: adminUserId, role: PoolMemberRole.ADMIN });
    if (!adminMembership) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Anda bukan admin pool ini." }, { status: 403 });
    }

    if (newStatus === JoinRequestStatus.APPROVED) {
      const memberCount = await PoolMember.countDocuments({ pool_id: pool._id });
      if (memberCount >= pool.max_members) {
        joinRequestDoc.status = JoinRequestStatus.REJECTED;
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
      await newMember.save();

      joinRequestDoc.status = JoinRequestStatus.APPROVED;
    } else if (newStatus === JoinRequestStatus.REJECTED) {
      joinRequestDoc.status = JoinRequestStatus.REJECTED;
    }

    joinRequestDoc.resolved_at = new Date().toISOString();
    joinRequestDoc.resolver_user_id = adminUserId as any;
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
    console.error("UPDATE_JOIN_REQUEST_ERROR:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => (val as Error).message);
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
