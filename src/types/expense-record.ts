import { ExpenseCategory } from "./enums";

export interface IExpenseRecord {
  _id: string;
  receipt_id: string;
  category: ExpenseCategory;
  medicine_name?: string;
  dosage?: string;
  quantity?: number;
  unit_price?: number;
  total_price: number;
}
