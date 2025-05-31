import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/db";
import Contribution from "@/models/contribution";
import MicrofundingPool from "@/models/microfunding-pool";
import { ContributionStatus, PaymentMethod } from "@/types/enums";

const MIDTRANS_SERVER_KEY_SANDBOX = process.env.MIDTRANS_SERVER_KEY_SANDBOX;

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Webhook Midtrans diterima");
    await connectToDatabase();
    const notificationPayload = await req.json();

    console.log("Menerima Webhook Midtrans:", JSON.stringify(notificationPayload, null, 2));

    if (!MIDTRANS_SERVER_KEY_SANDBOX) {
      console.error("Kunci Server Midtrans Sandbox tidak dikonfigurasi!");
      return NextResponse.json({ success: false, message: "Konfigurasi server Midtrans tidak lengkap." }, { status: 500 });
    }

    const { order_id, status_code, gross_amount, signature_key, transaction_status } = notificationPayload;

    const dataToHash = `${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY_SANDBOX}`;
    const generatedSignature = crypto.createHash("sha512").update(dataToHash).digest("hex");

    if (signature_key !== generatedSignature) {
      console.warn("⚠️ Signature Midtrans tidak valid.");
      return NextResponse.json({ success: false, message: "Signature tidak valid." }, { status: 403 });
    }
    console.log("✅ Signature Midtrans valid.");

    const contributionId = order_id;
    const contribution = await Contribution.findById(contributionId);

    if (!contribution) {
      console.error(`❌ Kontribusi dengan ID ${contributionId} tidak ditemukan.`);
      return NextResponse.json({ success: true, message: "Notifikasi diterima, namun kontribusi tidak ditemukan." }, { status: 200 });
    }

    if (contribution.status === ContributionStatus.SUCCESS || contribution.status === ContributionStatus.FAILED) {
      console.log(`ℹ️ Kontribusi ${contributionId} sudah dalam status final: ${contribution.status}. Notifikasi diabaikan.`);
      return NextResponse.json({ success: true, message: "Kontribusi sudah diproses sebelumnya." }, { status: 200 });
    }

    let newStatus: ContributionStatus = contribution.status;
    let paymentConfirmedDate: Date | undefined = undefined;
    const fraudStatus = notificationPayload.fraud_status;
    const transactionIdMidtrans = notificationPayload.transaction_id;

    console.log(`📊 Status transaksi Midtrans: ${transaction_status}, Fraud status: ${fraudStatus || "N/A"}`);

    if (transaction_status === "capture") {
      if (fraudStatus === "accept") {
        newStatus = ContributionStatus.SUCCESS;
        paymentConfirmedDate = new Date(notificationPayload.transaction_time || Date.now());
        console.log(`✅ Transaksi ${contributionId} berhasil (capture).`);
      } else if (fraudStatus === "challenge") {
        newStatus = ContributionStatus.PENDING;
        console.log(`⚠️ Transaksi ${contributionId} di-challenge oleh FDS Midtrans.`);
      } else {
        newStatus = ContributionStatus.FAILED;
        console.log(`❌ Transaksi ${contributionId} ditolak oleh FDS Midtrans.`);
      }
    } else if (transaction_status === "settlement") {
      newStatus = ContributionStatus.SUCCESS;
      paymentConfirmedDate = new Date(notificationPayload.settlement_time || notificationPayload.transaction_time || Date.now());
      console.log(`✅ Transaksi ${contributionId} berhasil (settlement).`);
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      newStatus = ContributionStatus.FAILED;
      console.log(`❌ Transaksi ${contributionId} gagal (${transaction_status}).`);
    } else if (transaction_status === "pending") {
      newStatus = ContributionStatus.PENDING;
      console.log(`⏳ Transaksi ${contributionId} masih pending.`);
    }

    contribution.status = newStatus;
    if (paymentConfirmedDate) {
      contribution.contribution_date = paymentConfirmedDate;
    }
    if (transactionIdMidtrans) {
      contribution.payment_gateway_reference_id = transactionIdMidtrans;
    }

    await contribution.save();
    console.log(`📝 Status kontribusi ${contributionId} diperbarui menjadi ${newStatus}`);

    if (newStatus === ContributionStatus.SUCCESS) {
      const pool = await MicrofundingPool.findById(contribution.pool);
      if (pool) {
        const paidAmount = parseFloat(notificationPayload.gross_amount);
        if (contribution.amount === paidAmount) {
          pool.current_amount = (pool.current_amount || 0) + contribution.amount;
          await pool.save();
          console.log(`💰 Jumlah dana pool ${pool._id} diperbarui menjadi ${pool.current_amount}`);
        } else {
          console.warn(`⚠️ Jumlah kontribusi (${contribution.amount}) tidak cocok dengan gross_amount dari Midtrans (${paidAmount}) untuk order ${contributionId}. Saldo pool tidak diperbarui otomatis.`);
        }
      } else {
        console.error(`❌ Pool dengan ID ${contribution.pool} tidak ditemukan untuk kontribusi ${contributionId}.`);
      }
    }

    return NextResponse.json({ success: true, message: "Notifikasi webhook berhasil diproses." }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Kesalahan pada webhook Midtrans:", error);
    return NextResponse.json({ success: false, message: `Kesalahan Internal Server: ${error.message}` }, { status: 500 });
  }
}

