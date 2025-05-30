import { Gender, IUser } from "@/types";
import mongoose, { Schema, models, Model } from "mongoose";

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
    age: {
      type: Number,
      required: [true, "Umur wajib diisi"],
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: [true, "Jenis kelamin wajib diisi"],
    },
    phone: {
      type: String,
    },
    ktp_number: {
      type: String,
      unique: true,
      sparse: true,
      required: [true, "Nomor KTP wajib diisi"],
    },
    address: {
      type: String,
      required: [true, "Alamat wajib diisi"],
    },
    bpjs_status: {
      type: Boolean,
      default: false,
      required: [true, "Status BPJS wajib diisi"],
    },
    employment_status: {
      type: String,
      required: [true, "Status pekerjaan wajib diisi"],
    },
    income_level: {
      type: Number,
      required: [true, "Tingkat pendapatan wajib diisi"],
    },
    education_level: {
      type: String,
      required: [true, "Tingkat pendidikan wajib diisi"],
    },
    chronic_conditions: {
      type: String,
      required: [true, "Kondisi kronis wajib diisi (isi 'Tidak ada' jika tidak memiliki)"],
    },
    max_budget: {
      type: Number,
      required: [true, "Preferensi maksimal budget wajib diisi"],
    },
    max_distance_km: {
      type: Number,
      required: [true, "Preferensi maksimal jarak wajib diisi"],
    },

    perusahaan: {
      type: String,
      default: "",
    },
    lamaBekerjaJumlah: {
      type: String,
      default: "",
    },
    lamaBekerjaSatuan: {
      type: String,
      default: "BULAN",
      enum: ["BULAN", "TAHUN"],
    },
    sumberPendapatanLain: {
      type: String,
      default: "",
    },
    kotaKabupaten: {
      type: String,
      default: "",
    },
    kodePos: {
      type: String,
      default: "",
    },
    provinsi: {
      type: String,
      default: "",
    },
    persetujuanAnalisisData: {
      type: Boolean,
      default: false,
    },

    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as Partial<IUser>;

  if (update && !update.education_level) {
    update.education_level = "Tidak Diisi";
  }

  if (update && !update.chronic_conditions) {
    update.chronic_conditions = "Tidak ada";
  }

  if (update && update.max_budget === undefined) {
    update.max_budget = 0;
  }

  if (update && update.max_distance_km === undefined) {
    update.max_distance_km = 10;
  }

  if (update && update.employment_status === undefined) {
    update.employment_status = "Tidak Bekerja";
  }

  if (update && update.income_level === undefined) {
    update.income_level = 0;
  }

  next();
});

const User: Model<IUser> = models.User || mongoose.model<IUser>("User", userSchema);

export default User;

