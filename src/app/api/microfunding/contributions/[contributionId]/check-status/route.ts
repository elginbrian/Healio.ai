// src/app/api/microfunding/contributions/[contributionId]/check-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import Contribution from "@/models/contribution";
import MicrofundingPool from "@/models/microfunding-pool";
import { ContributionStatus } from "@/types/enums";
import mongoose from "mongoose";

const MIDTRANS_SERVER_KEY_SANDBOX = process.env.MIDTRANS_SERVER_KEY_SANDBOX;

async function checkMidtransStatus(orderId: string) {
  if (!MIDTRANS_SERVER_KEY_SANDBOX) {
    throw new Error("Midtrans Server Key tidak dikonfigurasi");
  }

  const base64ServerKey = Buffer.from(MIDTRANS_SERVER_KEY_SANDBOX + ":").toString("base64");
  const midtransApiUrl = `https://api.sandbox.midtrans.com/v2/${orderId}/status`;

  try {
    const response = await fetch(midtransApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${base64ServerKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking Midtrans status:", error);
    throw error;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ contributionId: string }> }) {
  try {
    await connectToDatabase();
    const { contributionId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(contributionId)) {
      return NextResponse.json({ success: false, message: "Format Contribution ID tidak valid." }, { status: 400 });
    }

    // Verifikasi kontribusi milik pengguna yang sedang login
    const contribution = await Contribution.findOne({
      _id: contributionId,
      member: userId,
    });

    if (!contribution) {
      return NextResponse.json({ success: false, message: "Kontribusi tidak ditemukan atau Anda tidak memiliki akses." }, { status: 404 });
    }

    // Jika sudah sukses, tidak perlu cek ulang
    if (contribution.status === ContributionStatus.SUCCESS) {
      return NextResponse.json({
        success: true,
        message: "Pembayaran telah berhasil.",
        status: contribution.status,
        contribution,
      });
    }

    try {
      // Periksa status pembayaran di Midtrans
      const midtransStatus = await checkMidtransStatus(contributionId);
      console.log("Midtrans transaction status:", midtransStatus);

      // --- FIX DISINI ---
      // Beri tipe eksplisit pada newStatus agar TypeScript tidak mempersempit tipenya
      let newStatus: ContributionStatus = contribution.status;
      let paymentConfirmedDate;

      if (midtransStatus.transaction_status === "settlement" || (midtransStatus.transaction_status === "capture" && midtransStatus.fraud_status === "accept")) {
      if (midtransStatus.transaction_status === "settlement" || (midtransStatus.transaction_status === "capture" && midtransStatus.fraud_status === "accept")) {
        newStatus = ContributionStatus.SUCCESS;
        paymentConfirmedDate = new Date(midtransStatus.settlement_time || midtransStatus.transaction_time || Date.now());
      } else if (midtransStatus.transaction_status === "pending") {
        newStatus = ContributionStatus.PENDING;
      } else if (["deny", "cancel", "expire", "failure"].includes(midtransStatus.transaction_status)) {
        newStatus = ContributionStatus.FAILED;
      }

      // Update status kontribusi jika berubah
      if (newStatus !== contribution.status) {
        contribution.status = newStatus; // Sekarang ini valid

        if (paymentConfirmedDate) {
          contribution.contribution_date = paymentConfirmedDate;
        }


        await contribution.save();

        // Jika status berubah menjadi SUCCESS, update jumlah dana di pool
        if (newStatus === ContributionStatus.SUCCESS) {
          // Tidak perlu `await MicrofundingPool.findByIdAndUpdate` jika sudah mengambil pool
          const pool = await MicrofundingPool.findById(contribution.pool);
          if (pool) {
            pool.current_amount = (pool.current_amount || 0) + contribution.amount;
            await pool.save();
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Status kontribusi adalah ${newStatus}`,
        status: newStatus,
        midtransStatus: midtransStatus.transaction_status,
        contribution,
      });
    } catch (error: any) {
      console.error("Error checking Midtrans status:", error);
      return NextResponse.json(
        {
          success: false,
          message: `Gagal memeriksa status Midtrans: ${error.message}`,
          status: contribution.status,
          contribution,
        },
        { status: 500 }
      );
      return NextResponse.json(
        {
          success: false,
          message: `Gagal memeriksa status Midtrans: ${error.message}`,
          status: contribution.status,
          contribution,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error checking contribution status:", error);
    return NextResponse.json({ success: false, message: error.message || "Kesalahan server internal" }, { status: 500 });
  }
}
