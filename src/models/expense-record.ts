import mongoose, { Schema, Document, models, Model } from "mongoose";
import { ExpenseCategory } from "@/types";

export interface IExpenseRecordDocument extends Document {
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

const expenseRecordSchema = new Schema<IExpenseRecordDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
      index: true,
    },
    medicine_name: {
      type: String,
      trim: true,
    },
    facility_name: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(ExpenseCategory),
      default: ExpenseCategory.OTHER,
      required: [true, "Kategori pengeluaran wajib diisi"],
      index: true,
    },
    transaction_date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    total_price: {
      type: Number,
      required: [true, "Total harga wajib diisi"],
      min: [0, "Total harga tidak boleh negatif"],
    },
    payment_method: {
      type: String,
      trim: true,
    },
    receipt_id: {
      type: Schema.Types.ObjectId,
      ref: "Receipt",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for date range queries
expenseRecordSchema.index({ user_id: 1, transaction_date: 1 });
expenseRecordSchema.index({ user_id: 1, createdAt: 1 });

const ExpenseRecord: Model<IExpenseRecordDocument> = models.ExpenseRecord || mongoose.model<IExpenseRecordDocument>("ExpenseRecord", expenseRecordSchema);

export default ExpenseRecord;
