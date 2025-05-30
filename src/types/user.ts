import { Gender } from "./enums";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  age: number;
  gender: Gender;
  ktp_number: string;
  bpjs_status: boolean;
  address: string;
  latitude?: number;
  longitude?: number;
  chronic_conditions?: string;
  income_level?: number;
  employment_status?: string;
  education_level?: string;
  max_budget?: number;
  max_distance_km?: number;
  createdAt: string;
  updatedAt: string;
}
