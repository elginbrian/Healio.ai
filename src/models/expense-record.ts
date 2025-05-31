import mongoose, { Schema, Document, models, Model } from "mongoose";
import { IExpenseRecord, ExpenseCategory } from "@/types";

export interface IExpenseRecordDocument extends Document {
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

const expenseRecordSchema = new Schema<IExpenseRecordDocument>(
  {
    receipt_id: {
      type: Schema.Types.ObjectId,
      ref: "Receipt",
      required: [true, "Receipt ID wajib diisi"],
      index: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      required: [true, "Kategori pengeluaran wajib diisi"],
    },
    medicine_name: {
      type: String,
    },
    dosage: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    unit_price: {
      type: Number,
    },
    total_price: {
      type: Number,
      required: [true, "Total harga wajib diisi"],
    },
    transaction_date: {
      type: Date,
      default: Date.now,
    },
    facility_name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

expenseRecordSchema.index({ user_id: 1, transaction_date: -1 });
expenseRecordSchema.index({ user_id: 1, category: 1 });

const ExpenseRecord: Model<IExpenseRecordDocument> = models.ExpenseRecord || mongoose.model<IExpenseRecordDocument>("ExpenseRecord", expenseRecordSchema);

export default ExpenseRecord;

