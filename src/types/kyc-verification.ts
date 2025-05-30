import { KYCStatus } from "./enums";

export interface IKYCVerification {
  _id: string;
  user_id: string;
  ktp_number: string;
  verified_date?: string;
  status: KYCStatus;
  rejection_reason?: string;
}
