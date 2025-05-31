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
      type: String, // ISO date string
      default: () => new Date().toISOString(),
      required: true,
    },
    resolved_at: {
      type: String, // ISO date string
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

// Compound index to ensure one pending request per user per pool
joinRequestSchema.index({ pool_id: 1, user_id: 1, status: 1 }, { unique: true, partialFilterExpression: { status: JoinRequestStatus.PENDING } });

// Define a proper document interface that extends Document and IJoinRequest
export interface JoinRequestDocument extends Document, Omit<IJoinRequest, "_id"> {}

// Use the specific document interface for the model
const JoinRequest = models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);

export default JoinRequest;
