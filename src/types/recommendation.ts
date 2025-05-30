export interface IRecommendation {
  _id: string;
  user_id: string;
  facility_id: string;
  model_version: string;
  score: number;
  recommended_date: string;
}
