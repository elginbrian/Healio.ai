import { Gender } from "./enums";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  age?: number;
  gender?: Gender;
  phone?: string;
  ktp_number?: string;
  address?: string;
  bpjs_status?: boolean;
  employment_status?: string;
  income_level?: number;
  education_level?: string;
  chronic_conditions?: string;
  max_budget?: number;
  max_distance_km?: number;

  perusahaan?: string;
  lamaBekerjaJumlah?: string;
  lamaBekerjaSatuan?: string;
  sumberPendapatanLain?: string;
  kotaKabupaten?: string;
  kodePos?: string;
  provinsi?: string;
  persetujuanAnalisisData?: boolean;

  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
