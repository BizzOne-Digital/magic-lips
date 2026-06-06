import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default getModel<ICategory>("Category", CategorySchema);
