import { PoolStatus } from "./enums";

export interface IMicrofundingPool {
  _id: string;
  creator_user_id: string;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  created_date: string;
  deadline_date: string;
  status: PoolStatus;
}
