import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default getModel<IContactMessage>("ContactMessage", ContactMessageSchema);
