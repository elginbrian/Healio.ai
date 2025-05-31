import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IJoinRequest, JoinRequestStatus } from "@/types";

const joinRequestSchema = new Schema<IJoinRequest>(
  {
    pool_id: {
      type: Schema.Types.ObjectId,
      ref: "MicrofundingPool",
      required: [true, "Pool ID wajib diisi"],
      index: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(JoinRequestStatus),
      default: JoinRequestStatus.PENDING,
      required: true,
      index: true,
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

joinRequestSchema.index({ pool_id: 1, user_id: 1, status: 1 }, { unique: true, partialFilterExpression: { status: JoinRequestStatus.PENDING } });

export interface JoinRequestDocument extends Document, Omit<IJoinRequest, "_id"> {}

const JoinRequest = models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);

export default JoinRequest;

