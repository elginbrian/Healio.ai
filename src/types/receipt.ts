import mongoose from "mongoose";
import { ReceiptStatus } from "./enums";

export interface IReceipt {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  upload_date: Date;
  image_url: string;
  status: ReceiptStatus;
  ocr_raw_text?: string;
  processing_error?: string;
  createdAt: Date;
  updatedAt: Date;
}
