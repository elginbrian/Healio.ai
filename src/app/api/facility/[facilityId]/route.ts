import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Facility from "@/models/facility";
import mongoose from "mongoose";
import { getUserIdFromToken } from "@/lib/auth-util";

export async function GET(request: NextRequest, { params }: { params: { facilityId: string } }) {
  try {
    await connectToDatabase();

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const { facilityId } = params;

    if (!mongoose.Types.ObjectId.isValid(facilityId)) {
      return NextResponse.json({ success: false, message: "Format Facility ID tidak valid." }, { status: 400 });
    }

    const facility = await Facility.findById(facilityId).lean();

    if (!facility) {
      return NextResponse.json({ success: false, message: "Fasilitas tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        facility,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET_FACILITY_DETAIL_ERROR:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan saat mengambil detail fasilitas." }, { status: 500 });
  }
}
