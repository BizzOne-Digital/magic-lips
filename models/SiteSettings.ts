import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface ISiteSettings extends Document {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  instagramHandle: string;
  tiktokHandle: string;
  announcementBarText: string;
  announcementBarActive: boolean;
  footerCopyright: string;
  webDesignCredit?: string;
  metaTitle: string;
  metaDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: "Magic Lips" },
    phone: { type: String, default: "+1 647 495 0299" },
    email: { type: String, default: "magiclips2013@gmail.com" },
    address: { type: String, default: "3735 Dundas St W, York, ON M6S 2T6, Canada" },
    instagramHandle: { type: String, default: "magiclips2013" },
    tiktokHandle: { type: String, default: "magiclips02" },
    announcementBarText: {
      type: String,
      default: "✨ New subscribers get 10% off their first order! Use code: MAGIC10 ✨",
    },
    announcementBarActive: { type: Boolean, default: true },
    footerCopyright: { type: String, default: "© 2024 Magic Lips. All rights reserved." },
    webDesignCredit: { type: String },
    metaTitle: { type: String, default: "Magic Lips — Premium Lip Gloss & Beauty" },
    metaDescription: {
      type: String,
      default: "Shop premium lip gloss, lip liners, and beauty accessories at Magic Lips.",
    },
    logoUrl: { type: String },
    faviconUrl: { type: String },
  },
  { timestamps: true }
);

export default getModel<ISiteSettings>("SiteSettings", SiteSettingsSchema);
