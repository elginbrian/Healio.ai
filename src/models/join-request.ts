import mongoose, { Schema, models, Model } from "mongoose";
import { IJoinRequest } from "@/types";
import { JoinRequestStatus } from "@/types/enums";

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    pool_id: {
      type: Schema.Types.ObjectId,
      ref: "MicrofundingPool",
      required: [true, "Pool ID wajib diisi"],
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID pemohon wajib diisi"],
    },
    status: {
      type: String,
      enum: Object.values(JoinRequestStatus),
      default: JoinRequestStatus.PENDING,
      required: true,
    },
    requested_at: {
      type: String,
      default: () => new Date().toISOString(),
      required: true,
    },
    resolved_at: {
      type: String,
    },
    resolver_user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

joinRequestSchema.index({ pool_id: 1, user_id: 1, status: 1 });

const JoinRequest: Model<IJoinRequest> = models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);

export default JoinRequest;
