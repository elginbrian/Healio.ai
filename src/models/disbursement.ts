import mongoose, { Schema, Model, models, Document } from "mongoose";
import { IDisbursement, IVote, DisbursementStatus, VoteOption } from "@/types";

const VoteSchema = new Schema<IVote>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vote: { type: String, enum: Object.values(VoteOption), required: true },
    voted_at: { type: Date, default: Date.now, required: true },
    comment: { type: String },
  },
  { _id: false }
);

export interface IDisbursementDocument extends Omit<IDisbursement, "_id" | "createdAt" | "updatedAt">, Document {}

const DisbursementSchema = new Schema<IDisbursementDocument>(
  {
    pool_id: { type: Schema.Types.ObjectId, ref: "MicrofundingPool", required: true, index: true },
    recipient_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requested_by_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: [1, "Amount must be positive"] },
    purpose: { type: String, required: true, trim: true, maxlength: 500 },
    proof_url: { type: String, trim: true },
    status: { type: String, enum: Object.values(DisbursementStatus), default: DisbursementStatus.PENDING_VOTE, required: true, index: true },
    request_date: { type: Date, default: Date.now, required: true },
    voting_deadline: { type: Date },
    resolved_at: { type: Date },
    resolver_user_id: { type: Schema.Types.ObjectId, ref: "User" },
    disbursement_processing_details: { type: String },
    disbursement_transaction_id: { type: String },
    disbursement_date: { type: Date },
    votes_for: { type: Number, default: 0, min: 0 },
    votes_against: { type: Number, default: 0, min: 0 },
    voters: [VoteSchema],
  },
  {
    timestamps: true,
  }
);

DisbursementSchema.index({ _id: 1, "voters.user_id": 1 }, { unique: true, partialFilterExpression: { "voters.user_id": { $exists: true } } });
DisbursementSchema.index({ pool_id: 1, status: 1, voting_deadline: 1 });

const Disbursement: Model<IDisbursementDocument> = models.Disbursement || mongoose.model<IDisbursementDocument>("Disbursement", DisbursementSchema);

export default Disbursement;

