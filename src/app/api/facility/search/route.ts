import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Facility from "@/models/facility";
import { searchFacilitiesWithGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { query, userLocation, maxDistanceKm = 20, maxBudget = 500000 } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ message: "Query pencarian diperlukan" }, { status: 400 });
    }
    
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return NextResponse.json({ message: "Lokasi pengguna diperlukan" }, { status: 400 });
    }

    const searchResults = await searchFacilitiesWithGemini(
      query, 
      userLocation, 
      maxDistanceKm, 
      maxBudget
    );

    return NextResponse.json({ 
      message: "Pencarian berhasil", 
      data: searchResults,
      source: "gemini-search" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error searching facilities:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mencari fasilitas" }, 
      { status: 500 }
    );
  }
}

