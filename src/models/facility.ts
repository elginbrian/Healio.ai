import { IFacility, FacilityType } from "@/types";
import mongoose, { Schema, models, Model } from "mongoose";

const facilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(FacilityType), required: true },
    tariff_min: { type: Number, default: 0 },
    tariff_max: { type: Number, default: 0 },
    overall_rating: { type: Number, default: 0 },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    phone: { type: String },
    services_offered: [String],
  },
  {
    timestamps: true,
  }
);

facilitySchema.index({ location: "2dsphere" });

const Facility: Model<IFacility> = models.Facility || mongoose.model<IFacility>("Facility", facilitySchema);

export default Facility;
