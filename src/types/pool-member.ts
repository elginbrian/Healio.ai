import mongoose from "mongoose";
import { PoolMemberRole } from "./enums";

export interface IPoolMember {
  _id: string;
  pool_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  role: PoolMemberRole;
  recommended_contribution?: number;
  joined_date: string;
  createdAt?: string;
  updatedAt?: string;
}
