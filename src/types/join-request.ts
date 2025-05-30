import mongoose from "mongoose";
import { JoinRequestStatus } from "./enums";

export interface IJoinRequest {
  _id: string;
  pool_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  status: JoinRequestStatus;
  requested_at: string;
  resolved_at?: string;
  resolver_user_id?: mongoose.Types.ObjectId;
  createdAt?: string;
  updatedAt?: string;
}
