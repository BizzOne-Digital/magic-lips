import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface IGalleryMedia extends Document {
  title?: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const GalleryMediaSchema = new Schema<IGalleryMedia>(
  {
    title: { type: String },
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    thumbnail: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default getModel<IGalleryMedia>("GalleryMedia", GalleryMediaSchema);
