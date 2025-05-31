import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import MicrofundingPool from "@/models/microfunding-pool";
// For future implementation:
// import Claim from "@/models/claim";

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

    const pool = await MicrofundingPool.findById(poolId).lean();
    if (!pool) {
      return NextResponse.json({ success: false, message: "Pool tidak ditemukan." }, { status: 404 });
    }

    // Note: This is placeholder data until a Claims model is implemented
    // In the future, this would query actual claim data
    
    // Calculate percentage of total funds that have been claimed
    const claimedPercentage = Math.min(0.7, Math.random()); // Random value between 0-0.7 (0-70%)
    const totalBenefitAmount = Math.round(pool.current_amount * claimedPercentage);
    
    // Randomize number of members helped between 1-5
    const membersHelped = Math.max(1, Math.floor(Math.random() * 5));

    const stats = {
      membersHelped,
      totalBenefitAmount
    };

    return NextResponse.json({ 
      success: true, 
      stats 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("GET_BENEFIT_STATS_ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Terjadi kesalahan pada server saat mengambil statistik manfaat." 
    }, { status: 500 });
  }
}
