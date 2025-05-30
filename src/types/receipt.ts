import { ReceiptStatus } from "./enums";

export interface IReceipt {
  _id: string;
  user_id: string;
  upload_date: string;
  image_url: string;
  status: ReceiptStatus;
}
