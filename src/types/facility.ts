import { FacilityType } from "@/types";

interface IGeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IFacility {
  _id: string;
  name: string;
  type: FacilityType;
  tariff_min: number;
  tariff_max: number;
  overall_rating: number;
  address: string;
  location: IGeoJSONPoint;
  phone?: string;
  services_offered?: string[];
  createdAt: string;
  updatedAt: string;
}
