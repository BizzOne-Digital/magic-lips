import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface INewsletterSubscriber extends Document {
  email: string;
  discountCode: string;
  discountUsed: boolean;
  isActive: boolean;
  createdAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    discountCode: { type: String, required: true },
    discountUsed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default getModel<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
