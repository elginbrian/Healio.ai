import mongoose, { Schema, models, Model } from "mongoose";
import { IUser } from "@/types";
import { Gender } from "@/types/enums";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Format email tidak valid"],
    },
    password_hash: {
      type: String,
      required: [true, "Password wajib diisi"],
      select: false,
    },
    age: { type: Number },
    gender: { type: String, enum: Object.values(Gender) },

    ktp_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    bpjs_status: { type: Boolean, default: false },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    chronic_conditions: { type: String },
    income_level: { type: Number },
    employment_status: { type: String },
    education_level: { type: String },
    max_budget: { type: Number },
    max_distance_km: { type: Number },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = models.User || mongoose.model<IUser>("User", userSchema);

export default User;
