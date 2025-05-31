import { IReceipt, ReceiptStatus } from "@/types";

export interface IReceiptDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  upload_date: Date;
  image_url: string;
  status: ReceiptStatus;
  ocr_raw_text?: string;
  processing_error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const receiptSchema = new Schema<IReceiptDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
      index: true,
    },
    upload_date: {
      type: Date,
      default: Date.now,
      required: [true, "Tanggal unggah wajib diisi"],
    },
    image_url: {
      type: String,
      required: [true, "URL gambar struk wajib diisi"],
    },
    status: {
      type: String,
      enum: Object.values(ReceiptStatus),
      default: ReceiptStatus.PENDING,
      required: [true, "Status struk wajib diisi"],
    },
    ocr_raw_text: {
      type: String,
    },
    processing_error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Receipt: Model<IReceiptDocument> = models.Receipt || mongoose.model<IReceiptDocument>("Receipt", receiptSchema);

export default Receipt;

import { ReceiptStatus } from "@/types";
import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IReceiptDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  upload_date: Date;
  image_url: string;
  status: ReceiptStatus;
  ocr_raw_text?: string;
  processing_error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const receiptSchema = new Schema<IReceiptDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID wajib diisi"],
      index: true,
    },
    upload_date: {
      type: Date,
      default: Date.now,
      required: [true, "Tanggal unggah wajib diisi"],
    },
    image_url: {
      type: String,
      required: [true, "URL gambar struk wajib diisi"],
    },
    status: {
      type: String,
      enum: Object.values(ReceiptStatus),
      default: ReceiptStatus.PENDING,
      required: [true, "Status struk wajib diisi"],
    },
    ocr_raw_text: {
      type: String,
    },
    processing_error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Receipt: Model<IReceiptDocument> = models.Receipt || mongoose.model<IReceiptDocument>("Receipt", receiptSchema);

export default Receipt;
