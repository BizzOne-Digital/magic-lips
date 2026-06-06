import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  videos: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  isBundle: boolean;
  bundleItems?: { product: mongoose.Types.ObjectId; discountedPrice: number }[];
  tags: string[];
  sku: string;
  weight?: number;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    stock: { type: Number, default: 100 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBundle: { type: Boolean, default: false },
    bundleItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        discountedPrice: { type: Number },
      },
    ],
    tags: [{ type: String }],
    sku: { type: String, unique: true },
    weight: { type: Number },
  },
  { timestamps: true }
);

export default getModel<IProduct>("Product", ProductSchema);
