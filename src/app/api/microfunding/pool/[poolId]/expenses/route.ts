import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import PoolMember from "@/models/pool-member";

// Note: This is a placeholder until a Claims/Expenses model is implemented
// In a real implementation, you would import and query a Claims model

export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    // Check if user is a member of this pool
    const membership = await PoolMember.findOne({
      pool_id: new mongoose.Types.ObjectId(poolId),
      user_id: new mongoose.Types.ObjectId(userId)
    });

    if (!membership) {
      return NextResponse.json({ 
        success: false, 
        message: "Akses ditolak: Anda bukan anggota pool ini." 
      }, { status: 403 });
    }

    // Placeholder data - in a real implementation, you would query a Claims/Expenses collection
    const placeholderExpenses = [
      {
        _id: "expense1",
        type: 'Rawat Inap',
        description: 'Rawat Inap - Johan Arizona',
        hospital: 'RS Medika Sejahtera',
        date: new Date('2023-03-05'),
        amount: 3500000,
        status: 'APPROVED',
        claimant: { _id: 'user1', name: 'Johan Arizona' }
      },
      {
        _id: "expense2",
        type: 'Rawat Inap',
        description: 'Rawat Inap - Andreas Bagaskoro',
        hospital: 'RS Harapan Bunda',
        date: new Date('2023-02-12'),
        amount: 12000000,
        status: 'APPROVED',
        claimant: { _id: 'user2', name: 'Andreas Bagaskoro' }
      },
      {
        _id: "expense3",
        type: 'Obat',
        description: 'Obat - Elgin Brian',
        hospital: 'Apotek Sehat',
        date: new Date('2023-01-28'),
        amount: 850000,
        status: 'APPROVED',
        claimant: { _id: 'user3', name: 'Elgin Brian' }
      },
      {
        _id: "expense4",
        type: 'Konsultasi Spesialis',
        description: 'Konsultasi Spesialis - Rizqi Aditya',
        hospital: 'Klinik Spesialis Jantung',
        date: new Date('2023-01-15'),
        amount: 1200000,
        status: 'APPROVED',
        claimant: { _id: 'user4', name: 'Rizqi Aditya' }
      },
    ];
    
    return NextResponse.json({ 
      success: true, 
      expenses: placeholderExpenses,
      message: "Ini adalah data contoh. API untuk klaim/pengeluaran belum diimplementasikan sepenuhnya."
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("GET_POOL_EXPENSES_ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan pada server saat mengambil daftar pengeluaran." 
    }, { status: 500 });
  }
}
