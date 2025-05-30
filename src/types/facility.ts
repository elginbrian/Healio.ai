import { FacilityType } from "@/types";

interface IGeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IFacility {
  _id?: string;
  name: string;
  type: FacilityType | string;
  tariff_min?: number;
  tariff_max?: number;
  overall_rating?: number;
  address: string;

  location?: IGeoJSONPoint;

  latitude?: number;
  longitude?: number;

  distanceKm?: number;
  distanceText?: string;

  phone?: string;
  services_offered?: string[] | string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

