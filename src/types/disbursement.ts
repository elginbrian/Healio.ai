import mongoose from "mongoose";
import { DisbursementStatus, VoteOption } from "./enums";

export interface IVote {
  user_id: mongoose.Types.ObjectId;
  vote: VoteOption;
  voted_at: Date;
  comment?: string;
}

export interface IDisbursement {
  _id: mongoose.Types.ObjectId;
  pool_id: mongoose.Types.ObjectId;
  recipient_user_id: mongoose.Types.ObjectId;
  requested_by_user_id: mongoose.Types.ObjectId;
  amount: number;
  purpose: string;
  proof_url?: string;
  status: DisbursementStatus;
  request_date: Date;
  voting_deadline?: Date;
  resolved_at?: Date;
  resolver_user_id?: mongoose.Types.ObjectId;
  disbursement_processing_details?: string;
  disbursement_transaction_id?: string;
  disbursement_date?: Date;

  votes_for: number;
  votes_against: number;
  voters: IVote[];

  createdAt: Date;
  updatedAt: Date;
}

