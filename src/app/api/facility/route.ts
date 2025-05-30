import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/user";
import { generateMongoQueryWithGemini } from "@/lib/gemini";
import Facility from "@/models/facility";
import { getUserIdFromToken } from "@/lib/auth-util";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
    }

    const { preferences } = await request.json();
    if (!preferences || !preferences.userLocation?.latitude || !preferences.userLocation?.longitude) {
      return NextResponse.json({ message: "Preferensi dan lokasi pengguna wajib diisi." }, { status: 400 });
    }

    await connectToDatabase();

    const userProfile = await User.findById(userId).lean();
    if (!userProfile) {
      return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    const fullProfile = { ...userProfile, preferences };

    let facilities;
    let source = "gemini";

    try {
      const mongoQueryString = await generateMongoQueryWithGemini(fullProfile);

      if (!mongoQueryString || /delete|drop|update/i.test(mongoQueryString)) {
        throw new Error("Kueri yang dihasilkan AI tidak aman atau kosong.");
      }

      console.log("Executing Gemini Query:", mongoQueryString);
      const query = JSON.parse(mongoQueryString);
      facilities = await Facility.find(query).limit(10).lean();
    } catch (error) {
      console.error("GEMINI_RECOMMENDATION_ERROR:", error);

      source = "fallback";
      facilities = await Facility.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [preferences.userLocation.longitude, preferences.userLocation.latitude],
            },
            $maxDistance: (preferences.maxDistanceKm || 10) * 1000,
          },
        },
        tariff_max: { $lte: preferences.maxBudget || 10000000 },
      })
        .limit(5)
        .lean();
    }

    return NextResponse.json(
      {
        message: "Rekomendasi berhasil diambil.",
        source,
        data: facilities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FACILITY_RECOMMENDATION_API_ERROR", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
