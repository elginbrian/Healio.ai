import mongoose from "mongoose";
import { PoolStatus, ContributionPeriod, ClaimApprovalSystem } from "./enums";

export interface IMicrofundingPool {
  _id: string;
  creator_user_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  pool_code?: string;
  type_of_community: string;
  max_members: number;
  contribution_period: ContributionPeriod;
  contribution_amount_per_member: number;
  benefit_coverage: string[];
  claim_approval_system: ClaimApprovalSystem;
  claim_voting_duration: string;
  goal_amount: number;
  current_amount: number;
  created_date: string;
  deadline_date?: string;
  status: PoolStatus;
  createdAt?: string;
  updatedAt?: string;
}
