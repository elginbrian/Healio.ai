import mongoose, { Document, Model, Schema } from "mongoose";
import { ContributionStatus, IContribution, PaymentMethod } from "@/types";

export interface IContributionDocument extends Omit<IContribution, "_id" | "member_id" | "contribution_date" | "payment_method">, Document {
  _id: mongoose.Types.ObjectId;
  pool: mongoose.Types.ObjectId;
  member: mongoose.Types.ObjectId;
  amount: number;
  contribution_date: Date;
  payment_method: PaymentMethod;
  proof_url?: string;
  status: ContributionStatus;
  payment_gateway_reference_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContributionSchema: Schema<IContributionDocument> = new Schema(
  {
    pool: {
      type: Schema.Types.ObjectId,
      ref: "MicrofundingPool",
      required: [true, "Pool ID wajib diisi"],
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Member ID (User ID) wajib diisi"],
    },
    amount: {
      type: Number,
      required: [true, "Jumlah kontribusi wajib diisi"],
      min: [1, "Jumlah kontribusi minimal adalah 1"],
    },
    contribution_date: {
      type: Date,
      required: [true, "Tanggal kontribusi wajib diisi"],
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: [true, "Metode pembayaran wajib diisi"],
    },
    proof_url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(ContributionStatus),
      default: ContributionStatus.PENDING,
      required: true,
    },
    payment_gateway_reference_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ContributionSchema.index({ pool: 1, member: 1 });
ContributionSchema.index({ member: 1, contribution_date: -1 });

const Contribution: Model<IContributionDocument> = mongoose.models.Contribution || mongoose.model<IContributionDocument>("Contribution", ContributionSchema);

export default Contribution;

