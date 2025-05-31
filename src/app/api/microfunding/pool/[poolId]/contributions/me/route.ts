// File: src/app/api/microfunding/pool/[poolId]/contributions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth-util";
import connectToDatabase from "@/lib/db";
import Contribution from "@/models/contribution";
import MicrofundingPool from "@/models/microfunding-pool";
import User from "@/models/user";
import { ContributionStatus, PaymentMethod } from "@/types/enums";
import mongoose from "mongoose";

// Fungsi untuk membuat transaksi Snap Midtrans
async function createMidtransSnapTransaction(
  contributionId: string,
  amount: number,
  user: { email: string; name: string; phone?: string } // Menambahkan phone jika ada
) {
  const midtransApiUrl = "https://app.sandbox.midtrans.com/snap/v1/transactions";
  // Ambil Server Key dari environment variable
  const serverKey = process.env.MIDTRANS_SERVER_KEY_SANDBOX;

  if (!serverKey) {
    throw new Error("Midtrans Server Key tidak dikonfigurasi di environment.");
  }

  // Otentikasi Basic Auth untuk Midtrans API
  const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");

  const transactionPayload = {
    transaction_details: {
      order_id: contributionId, // ID unik dari sisi kita
      gross_amount: Math.round(amount), // Midtrans mengharapkan integer untuk amount
    },
    customer_details: {
      first_name: user.name.split(" ")[0],
      last_name: user.name.split(" ").slice(1).join(" ") || user.name.split(" ")[0],
      email: user.email,
      phone: user.phone || "N/A", // Tambahkan nomor telepon jika ada
    },
  };

  console.log("Mengirim payload ke Midtrans:", JSON.stringify(transactionPayload, null, 2));

  try {
    const response = await fetch(midtransApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${base64ServerKey}`,
      },
      body: JSON.stringify(transactionPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Midtrans API Error Response:", responseData);
      const errorMessages = responseData.error_messages || [`HTTP Error: ${response.status}`];
      throw new Error(`Gagal membuat transaksi Midtrans: ${errorMessages.join(", ")}`);
    }

    if (!responseData.token) {
      console.error("Midtrans tidak mengembalikan token:", responseData);
      throw new Error("Midtrans tidak mengembalikan token transaksi.");
    }

    console.log("Midtrans Snap Token diterima:", responseData.token);
    return {
      token: responseData.token, // Token untuk digunakan oleh Snap.js
      redirect_url: responseData.redirect_url, // URL redirect jika Snap tidak digunakan
    };
  } catch (error: any) {
    console.error("Error saat memanggil API Midtrans:", error);
    throw new Error(`Gagal menghubungi Midtrans: ${error.message}`);
  }
}

// --- FIX DISINI ---
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ poolId: string }> } // 1. Perbaiki tipe 'params' menjadi Promise
) {
  try {
    await connectToDatabase();
    const userId = getUserIdFromToken(req.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Tidak terautentikasi." }, { status: 401 });
    }

    const currentUser = await User.findById(userId).select("name email phone").lean();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const { poolId } = await params; // 2. Gunakan 'await' untuk mendapatkan 'poolId'
    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const { amount, payment_method } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, message: "Jumlah kontribusi harus berupa angka positif." }, { status: 400 });
    }
    if (!payment_method || !Object.values(PaymentMethod).includes(payment_method as PaymentMethod)) {
      console.warn("Metode pembayaran dari klien:", payment_method, "akan dicatat, tetapi Snap Midtrans akan menampilkan pilihan akhir.");
    }

    const pool = await MicrofundingPool.findById(poolId);
    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
    }

    // Membuat entri kontribusi di database dengan status PENDING
    const newContribution = new Contribution({
      pool: poolId,
      member: userId,
      amount: amount,
      contribution_date: new Date(),
      payment_method: payment_method || PaymentMethod.E_WALLET,
      status: ContributionStatus.PENDING,
    });
    await newContribution.save();

    // Membuat transaksi di Midtrans Sandbox
    const midtransTransaction = await createMidtransSnapTransaction(newContribution._id.toString(), amount, { email: currentUser.email, name: currentUser.name, phone: currentUser.phone });

    // Simpan token Midtrans
    newContribution.payment_gateway_reference_id = midtransTransaction.token;
    await newContribution.save();

    return NextResponse.json(
      {
        success: true,
        message: "Inisialisasi kontribusi berhasil. Silakan lanjutkan pembayaran.",
        contributionId: newContribution._id.toString(),
        paymentToken: midtransTransaction.token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gagal memproses pembuatan kontribusi:", error);
    return NextResponse.json({ success: false, message: error.message || "Kesalahan Internal Server." }, { status: 500 });
  }
}

// Handler GET Anda sudah benar
export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    const contributions = await Contribution.find({
      pool: poolId,
      member: userId,
    }).sort({ contribution_date: -1 });

    return NextResponse.json(
      {
        success: true,
        contributions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching user contributions:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan saat mengambil data kontribusi pengguna.",
      },
      { status: 500 }
    );
  }
}
