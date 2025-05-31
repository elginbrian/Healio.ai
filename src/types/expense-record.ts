import mongoose from "mongoose";
import { ExpenseCategory } from "./enums";

export interface IExpenseRecord {
  _id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  medicine_name?: string;
  facility_name?: string;
  category: ExpenseCategory | string;
  transaction_date?: Date;
  total_price: number;
  payment_method?: string;
  receipt_id?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSummary {
  totalSpending: number;
  periodLabel: string;
  dateRange: {
    start: string;
    end: string;
  };
}
