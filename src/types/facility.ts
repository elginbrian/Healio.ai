import { FacilityType } from "./enums";

export interface IFacility {
  _id: string;
  name: string;
  type: FacilityType;
  tariff_min: number;
  tariff_max: number;
  overall_rating: number;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  services_offered?: string;
  createdAt: string;
  updatedAt: string;
}
