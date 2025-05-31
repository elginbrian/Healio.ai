import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import { PoolMemberRole, JoinRequestStatus } from "@/types/enums";
import JoinRequest from "@/models/join-request";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

interface PatchRequestBody {
  status: JoinRequestStatus;
  reason?: string;
}

export async function PATCH(request: NextRequest, { params }: { params: { requestId: string } }) {
  let session: mongoose.ClientSession | null = null;
  try {
    console.log("Starting PATCH operation for join request ID:", params.requestId);
    await connectToDatabase();

    const { requestId } = params;
    if (!requestId) {
      console.error("No requestId provided in params");
      return NextResponse.json({ success: false, message: "Request ID tidak ditemukan." }, { status: 400 });
    }

    console.log("Processing request for join-request ID:", requestId);

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      console.error("Invalid ObjectId format:", requestId);
      return NextResponse.json({ success: false, message: "Format Request ID tidak valid." }, { status: 400 });
    }

    const adminUserId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!adminUserId) {
      console.error("User not authenticated");
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    let body: PatchRequestBody;
    try {
      body = await request.json();
      console.log("Request body:", body);
    } catch (e) {
      console.error("Invalid JSON body:", e);
      return NextResponse.json({ success: false, message: "Request body tidak valid (JSON)." }, { status: 400 });
    }

    const { status: newStatus } = body;
    if (!newStatus || !Object.values(JoinRequestStatus).includes(newStatus)) {
      console.error("Invalid status value:", newStatus);
      return NextResponse.json({ success: false, message: "Status baru tidak valid." }, { status: 400 });
    }

    // Start MongoDB session
    session = await mongoose.startSession();
    let updatedRequest;

    await session.withTransaction(async () => {
      // Find join request
      const joinRequestDoc = await JoinRequest.findById(requestId).session(session);
      if (!joinRequestDoc) {
        console.error("Join request not found:", requestId);
        throw new Error("NOT_FOUND");
      }

      if (joinRequestDoc.status !== JoinRequestStatus.PENDING) {
        console.error("Join request already processed:", joinRequestDoc.status);
        throw new Error("ALREADY_PROCESSED");
      }

      // Find pool
      const pool = await MicrofundingPool.findById(joinRequestDoc.pool_id).session(session);
      if (!pool) {
        console.error("Pool not found for join request:", joinRequestDoc.pool_id);
        throw new Error("POOL_NOT_FOUND");
      }

      // Check if user is admin
      const adminMembership = await PoolMember.findOne({
        pool_id: pool._id,
        user_id: adminUserId,
        role: PoolMemberRole.ADMIN,
      }).session(session);

      if (!adminMembership) {
        console.error("User is not admin:", adminUserId);
        throw new Error("FORBIDDEN");
      }

      // If approving, check pool conditions
      if (newStatus === JoinRequestStatus.APPROVED) {
        const memberCount = await PoolMember.countDocuments({ pool_id: pool._id }).session(session);
        if (memberCount >= pool.max_members) {
          console.error("Pool is full. Current members:", memberCount, "Max members:", pool.max_members);
          throw new Error("POOL_FULL");
        }

        const existingMember = await PoolMember.findOne({
          pool_id: pool._id,
          user_id: joinRequestDoc.user_id,
        }).session(session);

        if (existingMember) {
          console.error("User is already a member:", joinRequestDoc.user_id);
          throw new Error("USER_ALREADY_MEMBER");
        }

        // Create new member
        const newMember = new PoolMember({
          pool_id: pool._id,
          user_id: joinRequestDoc.user_id,
          role: PoolMemberRole.MEMBER,
          joined_date: new Date(),
        });
        await newMember.save({ session });
        console.log("New member added to pool:", newMember._id);
      }

      // Update join request status
      joinRequestDoc.status = newStatus;
      joinRequestDoc.resolved_at = new Date();
      joinRequestDoc.resolver_user_id = new mongoose.Types.ObjectId(adminUserId);

      updatedRequest = await joinRequestDoc.save({ session });
      console.log("Join request updated successfully:", updatedRequest._id, "New status:", updatedRequest.status);
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
    console.error("PATCH_JOIN_REQUEST_ERROR:", error.message, error.stack);

    // Handle specific errors
    if (error.message === "NOT_FOUND") return NextResponse.json({ success: false, message: "Permintaan bergabung tidak ditemukan." }, { status: 404 });
    if (error.message === "ALREADY_PROCESSED") return NextResponse.json({ success: false, message: "Permintaan ini sudah diproses sebelumnya." }, { status: 409 });
    if (error.message === "POOL_NOT_FOUND") return NextResponse.json({ success: false, message: "Pool terkait tidak ditemukan. Terjadi inkonsistensi data." }, { status: 500 });
    if (error.message === "FORBIDDEN") return NextResponse.json({ success: false, message: "Akses ditolak: Anda bukan admin pool ini." }, { status: 403 });
    if (error.message === "POOL_FULL") return NextResponse.json({ success: false, message: "Gagal menyetujui: Pool sudah penuh." }, { status: 409 });
    if (error.message === "USER_ALREADY_MEMBER") return NextResponse.json({ success: false, message: "Gagal menyetujui: Pengguna ini sudah menjadi anggota pool." }, { status: 409 });
    if (error.code === 11000) return NextResponse.json({ success: false, message: "Gagal menambahkan anggota. Kemungkinan pengguna ini sudah menjadi anggota." }, { status: 409 });

    // General error handling
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (session) {
      await session.endSession();
      console.log("MongoDB session ended");
    }
  }
}
