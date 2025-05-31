// src/app/api/microfunding/disbursements/[disbursementId]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import Disbursement from "@/models/disbursement";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";
import { DisbursementStatus, VoteOption, PoolMemberRole, ClaimApprovalSystem } from "@/types";
import mongoose from "mongoose";

// Helper function to evaluate votes and update disbursement status
async function evaluateVotes(disbursementId: mongoose.Types.ObjectId | string) {
  const disbursement = await Disbursement.findById(disbursementId);
  if (!disbursement || disbursement.status !== DisbursementStatus.PENDING_VOTE) {
    console.log(`Disbursement ${disbursementId} not in PENDING_VOTE or not found, evaluation skipped.`);
    return;
  }

  const pool = await MicrofundingPool.findById(disbursement.pool_id);
  if (!pool) {
    console.error(`Pool ${disbursement.pool_id} not found for disbursement ${disbursement._id}`);
    // Potentially set disbursement to FAILED or require admin intervention
    return;
  }

  const totalPoolMembers = await PoolMember.countDocuments({ pool_id: disbursement.pool_id });
  if (totalPoolMembers === 0) {
    console.warn(`Pool ${disbursement.pool_id} has no members for disbursement ${disbursement._id}`);
    disbursement.status = DisbursementStatus.REJECTED;
    // disbursement.rejection_reason = "Tidak ada anggota aktif di pool untuk melakukan voting."; // Consider adding a reason field
    disbursement.resolved_at = new Date();
    await disbursement.save();
    return;
  }

  let approved = false;
  // Calculate the minimum number of "FOR" votes needed for approval ("more than 50%")
  const minVotesForApproval = Math.floor(totalPoolMembers / 2) + 1;

  if (pool.claim_approval_system === ClaimApprovalSystem.VOTING_50_PERCENT) {
    if (disbursement.votes_for >= minVotesForApproval) {
      approved = true;
    }
  }
  // Add other approval systems if any based on pool.claim_approval_system

  const now = new Date();
  const deadlinePassed = disbursement.voting_deadline && now > disbursement.voting_deadline;

  if (approved) {
    disbursement.status = DisbursementStatus.APPROVED;
    disbursement.resolved_at = now;
    console.log(`Disbursement ${disbursement._id} approved by vote.`);
  } else if (deadlinePassed) {
    disbursement.status = DisbursementStatus.REJECTED;
    // disbursement.rejection_reason = "Batas waktu voting terlampaui dan tidak mencapai persetujuan.";
    disbursement.resolved_at = now;
    console.log(`Disbursement ${disbursement._id} rejected due to voting deadline.`);
  } else {
    // Check if approval is still mathematically possible before the deadline
    const votesStillNeeded = minVotesForApproval - disbursement.votes_for;
    // Number of members who haven't voted yet
    const remainingPotentialVoters = totalPoolMembers - disbursement.voters.length;

    if (votesStillNeeded > 0 && remainingPotentialVoters < votesStillNeeded) {
      // Not enough remaining voters to reach the threshold even if all vote FOR
      disbursement.status = DisbursementStatus.REJECTED;
      // disbursement.rejection_reason = "Tidak cukup sisa suara untuk mencapai persetujuan.";
      disbursement.resolved_at = now;
      console.log(`Disbursement ${disbursement._id} rejected as approval is no longer mathematically possible.`);
    }
    // Otherwise, it remains PENDING_VOTE
  }

  // Only save if status actually changed or it's the first evaluation after a vote
  // This check might be redundant if evaluateVotes is always called after a change or by cron.
  // However, to be safe, we ensure it saves if status changes.
  // For simplicity, we'll save if it was PENDING_VOTE and might have changed.
  if (disbursement.isModified("status") || disbursement.status === DisbursementStatus.PENDING_VOTE) {
    await disbursement.save();
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ disbursementsId: string }> }) {
  try {
    await connectToDatabase();
    const { disbursementsId } = await params; // Correctly await and destructure the params
    const currentUserId = getUserIdFromToken(request.headers.get("Authorization"));

    if (!currentUserId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!disbursementsId) {
      return NextResponse.json({ success: false, message: "Request ID tidak ditemukan dalam parameter." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(disbursementsId)) {
      return NextResponse.json({ success: false, message: "Format Disbursement ID tidak valid." }, { status: 400 });
    }

    const { vote, comment } = await request.json();
    if (!vote || !Object.values(VoteOption).includes(vote as VoteOption)) {
      return NextResponse.json({ success: false, message: "Pilihan vote (FOR/AGAINST) wajib diisi dan valid." }, { status: 400 });
    }

    const disbursementObjectId = new mongoose.Types.ObjectId(disbursementsId);
    const userObjectId = new mongoose.Types.ObjectId(currentUserId);

    // Use a transaction for atomic read and write if your MongoDB setup supports it
    // For simplicity, we proceed without explicit transaction here, but it's best practice.

    const disbursement = await Disbursement.findById(disbursementObjectId);
    if (!disbursement) {
      return NextResponse.json({ success: false, message: "Permintaan pengeluaran tidak ditemukan." }, { status: 404 });
    }

    if (disbursement.status !== DisbursementStatus.PENDING_VOTE) {
      return NextResponse.json({ success: false, message: "Periode voting untuk permintaan ini sudah selesai atau belum dimulai." }, { status: 400 });
    }

    if (disbursement.voting_deadline && new Date() > disbursement.voting_deadline) {
      // Call evaluateVotes to ensure status is updated if deadline passed just now
      await evaluateVotes(disbursementObjectId);
      // Fetch the (potentially) updated disbursement to return the correct final status
      const finalDisbursementState = await Disbursement.findById(disbursementObjectId).lean();
      return NextResponse.json({ success: false, message: "Batas waktu voting telah berakhir.", disbursement: finalDisbursementState }, { status: 400 });
    }

    const member = await PoolMember.findOne({ pool_id: disbursement.pool_id, user_id: userObjectId });
    if (!member) {
      return NextResponse.json({ success: false, message: "Anda bukan anggota pool ini dan tidak dapat vote." }, { status: 403 });
    }

    if (disbursement.recipient_user_id.equals(userObjectId)) {
      return NextResponse.json({ success: false, message: "Anda tidak dapat vote untuk permintaan dana Anda sendiri." }, { status: 403 });
    }

    const alreadyVoted = disbursement.voters.find((v) => v.user_id.equals(userObjectId));
    if (alreadyVoted) {
      return NextResponse.json({ success: false, message: "Anda sudah memberikan vote untuk permintaan ini." }, { status: 409 });
    }

    // Record vote
    disbursement.voters.push({
      user_id: userObjectId,
      vote: vote as VoteOption,
      voted_at: new Date(),
      comment: comment || undefined,
    });

    if (vote === VoteOption.FOR) {
      disbursement.votes_for = (disbursement.votes_for || 0) + 1;
    } else if (vote === VoteOption.AGAINST) {
      disbursement.votes_against = (disbursement.votes_against || 0) + 1;
    }

    await disbursement.save(); // Save the vote first

    // Evaluate votes after this vote
    await evaluateVotes(disbursementObjectId);

    // Fetch the latest state of the disbursement after evaluation
    const updatedDisbursement = await Disbursement.findById(disbursementObjectId).populate("recipient_user_id", "name email").populate("requested_by_user_id", "name email").lean();

    return NextResponse.json({ success: true, message: "Vote Anda berhasil direkam.", disbursement: updatedDisbursement }, { status: 200 });
  } catch (error: any) {
    console.error("CAST_VOTE_ERROR:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
