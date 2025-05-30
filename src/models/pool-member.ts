import mongoose, { Schema, models, Model } from "mongoose";
import { IPoolMember } from "@/types";
import { PoolMemberRole } from "@/types/enums";

const poolMemberSchema = new Schema<IPoolMember>(
  {
    pool_id: {
      type: Schema.Types.ObjectId,
      ref: "MicrofundingPool",
      required: [true, "Pool ID wajib diisi"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
    },
    role: {
      type: String,
      enum: Object.values(PoolMemberRole),
      default: PoolMemberRole.MEMBER,
      required: true,
    },
    recommended_contribution: {
      type: Number,
    },
    joined_date: {
      type: String,
      default: () => new Date().toISOString(),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

poolMemberSchema.index({ pool_id: 1, user_id: 1 }, { unique: true });

const PoolMember: Model<IPoolMember> = models.PoolMember || mongoose.model<IPoolMember>("PoolMember", poolMemberSchema);

export default PoolMember;
