export interface IReview {
  _id: string;
  user_id: string;
  facility_id: string;
  rating: number;
  comment?: string;
  review_date: string;
}
