import mongoose from "mongoose";
import { DisbursementStatus, VoteOption } from "./enums";

export interface IVote {
  user_id: mongoose.Types.ObjectId; // Reference to User model
  vote: VoteOption;
  voted_at: Date;
  comment?: string; // Optional comment with the vote
}

export interface IDisbursement {
  _id: mongoose.Types.ObjectId; // Changed to always be ObjectId for consistency
  pool_id: mongoose.Types.ObjectId; // Reference to MicrofundingPool model
  recipient_user_id: mongoose.Types.ObjectId; // Reference to User model (who receives funds)
  requested_by_user_id: mongoose.Types.ObjectId; // Reference to User model (who made the request)
  amount: number;
  purpose: string;
  proof_url?: string; // URL for bills, invoices, etc.
  status: DisbursementStatus;
  request_date: Date;
  voting_deadline?: Date; // Calculated based on pool's claim_voting_duration
  // approval_date?: Date; // Date when voting passed or admin approved
  // rejection_reason?: string;
  resolved_at?: Date; // Date when the request was approved/rejected
  resolver_user_id?: mongoose.Types.ObjectId; // Admin who manually approved/rejected, or null for system
  disbursement_processing_details?: string; // e.g., notes about payout processing
  disbursement_transaction_id?: string; // ID from payment gateway for the payout, if applicable
  disbursement_date?: Date; // Date when funds were actually confirmed as transferred

  // Voting specific fields
  votes_for: number;
  votes_against: number;
  voters: IVote[]; // Array to store individual votes

  createdAt: Date; // Ensure Mongoose timestamps add this
  updatedAt: Date; // Ensure Mongoose timestamps add this
}
