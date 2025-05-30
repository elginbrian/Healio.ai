import { PaymentMethod } from "./enums";

export interface IContribution {
  _id: string;
  member_id: string;
  amount: number;
  contribution_date: string;
  payment_method: PaymentMethod;
  proof_url?: string;
}
