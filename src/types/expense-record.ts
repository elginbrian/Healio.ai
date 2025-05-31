import mongoose from "mongoose";
import { ExpenseCategory } from "./enums";

export interface IExpenseRecord {
  _id: mongoose.Types.ObjectId;
  receipt_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  category: ExpenseCategory;
  medicine_name?: string;
  dosage?: string;
  quantity?: number;
  unit_price?: number;
  total_price: number;
  transaction_date: Date;
  facility_name?: string;
  createdAt: Date;
  updatedAt: Date;
}
