export interface IDisbursement {
  _id: string;
  pool_id: string;
  recipient_user_id: string;
  amount: number;
  purpose: string;
  proof_url: string;
  disbursement_date: string;
}
