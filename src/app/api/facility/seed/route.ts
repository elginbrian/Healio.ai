import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Facility from "@/models/facility";
import { IFacility, FacilityType } from "@/types";
import { getUserIdFromToken } from "@/lib/auth-util";

interface SeedFacilityItem extends Omit<IFacility, "_id" | "createdAt" | "updatedAt" | "location"> {
  name: string;
  type: FacilityType;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  tariff_min?: number;
  tariff_max?: number;
  overall_rating?: number;
  phone?: string;
  services_offered?: string[];
  image_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const facilitiesToSeed: SeedFacilityItem[] = await request.json();

    if (!Array.isArray(facilitiesToSeed) || facilitiesToSeed.length === 0) {
      return NextResponse.json({ success: false, message: "Data fasilitas untuk seeding tidak valid atau kosong." }, { status: 400 });
    }

    let facilitiesAdded = 0;
    let facilitiesSkipped = 0;
    const errors: { facilityName?: string; error: string }[] = [];
    const addedFacilitiesDetails: Partial<IFacility>[] = [];

    for (const facilityData of facilitiesToSeed) {
      if (
        !facilityData.name ||
        !facilityData.address ||
        !facilityData.type ||
        !facilityData.location ||
        typeof facilityData.location !== "object" ||
        !facilityData.location.coordinates ||
        !Array.isArray(facilityData.location.coordinates) ||
        facilityData.location.coordinates.length !== 2 ||
        typeof facilityData.location.coordinates[0] !== "number" ||
        typeof facilityData.location.coordinates[1] !== "number"
      ) {
        errors.push({ facilityName: facilityData.name || "Nama Tidak Diketahui", error: "Data fasilitas tidak lengkap (nama, alamat, tipe, atau format lokasi salah)." });
        facilitiesSkipped++;
        continue;
      }

      facilityData.location.type = "Point";

      if (!Object.values(FacilityType).includes(facilityData.type as FacilityType)) {
        errors.push({ facilityName: facilityData.name, error: `Tipe fasilitas '${facilityData.type}' tidak valid.` });
        facilitiesSkipped++;
        continue;
      }

      try {
        const existingFacility = await Facility.findOne({ name: facilityData.name, address: facilityData.address });
        if (existingFacility) {
          facilitiesSkipped++;
        } else {
          const newFacility = await Facility.create(facilityData);
          addedFacilitiesDetails.push({
            _id: newFacility._id.toString(),
            name: newFacility.name,
            type: newFacility.type,
            address: newFacility.address,
          });
          facilitiesAdded++;
        }
      } catch (e: any) {
        errors.push({ facilityName: facilityData.name, error: e.message || "Gagal menyimpan fasilitas ke database." });
        facilitiesSkipped++;
      }
    }

    if (errors.length > 0 && errors.length === facilitiesToSeed.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua fasilitas gagal di-seed.",
          facilitiesAdded,
          facilitiesSkipped,
          errors,
        },
        { status: 500 }
      );
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Beberapa fasilitas gagal di-seed, namun sebagian lainnya mungkin berhasil.",
          facilitiesAdded,
          facilitiesSkipped,
          addedFacilities: addedFacilitiesDetails,
          errors,
        },
        { status: 207 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Seeding fasilitas berhasil diselesaikan.",
        facilitiesAdded,
        facilitiesSkipped,
        addedFacilities: addedFacilitiesDetails,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("FACILITY_SEED_API_ERROR:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, message: "Request body tidak valid atau bukan format JSON." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan internal pada server saat melakukan seeding." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: false, message: "Metode GET tidak diizinkan untuk endpoint /api/facility/seed." }, { status: 405 });
}
