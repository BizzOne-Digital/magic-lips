import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface IOffer extends Document {
  title: string;
  description: string;
  type: "percentage" | "fixed" | "bundle" | "bogo";
  discountValue: number;
  couponCode?: string;
  minPurchase?: number;
  isActive: boolean;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  applicableProducts?: mongoose.Types.ObjectId[];
  image?: string;
}

const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["percentage", "fixed", "bundle", "bogo"], required: true },
    discountValue: { type: Number, required: true },
    couponCode: { type: String, uppercase: true },
    minPurchase: { type: Number },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    image: { type: String },
  },
  { timestamps: true }
);

export default getModel<IOffer>("Offer", OfferSchema);
