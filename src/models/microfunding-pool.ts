import mongoose, { Schema, models, Model } from "mongoose";
import { IMicrofundingPool } from "@/types";
import { PoolStatus, ContributionPeriod, ClaimApprovalSystem } from "@/types/enums";

const microfundingPoolSchema = new Schema<IMicrofundingPool>(
  {
    creator_user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator User ID wajib diisi"],
    },
    title: {
      type: String,
      required: [true, "Judul pool wajib diisi"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Deskripsi pool wajib diisi"],
    },
    pool_code: {
      type: String,
      required: [true, "Kode pool wajib diisi"],
      unique: true,
      trim: true,
    },
    type_of_community: {
      type: String,
      required: [true, "Jenis komunitas wajib diisi"],
    },
    max_members: {
      type: Number,
      required: [true, "Jumlah maksimal anggota wajib diisi"],
      min: [1, "Jumlah maksimal anggota minimal 1"],
    },
    contribution_period: {
      type: String,
      enum: Object.values(ContributionPeriod),
      required: [true, "Periode kontribusi wajib diisi"],
    },
    contribution_amount_per_member: {
      type: Number,
      required: [true, "Jumlah iuran wajib diisi"],
      min: [0, "Jumlah iuran tidak boleh negatif"],
    },
    benefit_coverage: {
      type: [String],
      default: [],
    },
    claim_approval_system: {
      type: String,
      enum: Object.values(ClaimApprovalSystem),
      default: ClaimApprovalSystem.VOTING_50_PERCENT,
    },
    claim_voting_duration: {
      type: String,
      default: "24_HOURS",
    },
    goal_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    current_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    created_date: {
      type: String,
      default: () => new Date().toISOString(),
      required: true,
    },
    deadline_date: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PoolStatus),
      default: PoolStatus.OPEN,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MicrofundingPool: Model<IMicrofundingPool> = models.MicrofundingPool || mongoose.model<IMicrofundingPool>("MicrofundingPool", microfundingPoolSchema);

export default MicrofundingPool;

