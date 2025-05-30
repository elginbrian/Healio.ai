export interface IPoolMember {
  _id: string;
  pool_id: string;
  user_id: string;
  recommended_contribution?: number;
  joined_date: string;
}
