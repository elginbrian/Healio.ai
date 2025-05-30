import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Facility from "@/models/facility";
import { FacilityType } from "@/types";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { preferences } = await request.json();
    const { userLocation, maxDistanceKm = 20 } = preferences;

    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return NextResponse.json({ message: "Lokasi pengguna diperlukan" }, { status: 400 });
    }

    const maxDistance = maxDistanceKm * 1000;

    const nearbyQuery = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [userLocation.longitude, userLocation.latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    };

    const nearbyFacilities = await Facility.find(nearbyQuery).limit(20);

    const facilitiesWithDistance = nearbyFacilities.map((facility) => {
      if (facility.location?.coordinates && facility.location.coordinates.length === 2) {
        const facilityLon = facility.location.coordinates[0];
        const facilityLat = facility.location.coordinates[1];

        const distanceKm = calculateDistance(userLocation.latitude, userLocation.longitude, facilityLat, facilityLon);

        return {
          ...facility.toObject(),
          distanceKm,
          distanceText: `${distanceKm} km`,
        };
      }
      return {
        ...facility.toObject(),
        distanceKm: null,
        distanceText: "Jarak tidak diketahui",
      };
    });

    facilitiesWithDistance.sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });

    return NextResponse.json(
      {
        message: "Fasilitas di sekitar berhasil ditemukan",
        data: facilitiesWithDistance,
        source: "db-proximity",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding nearby facilities:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat mencari fasilitas di sekitar" }, { status: 500 });
  }
}

