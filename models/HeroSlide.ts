import mongoose, { Document, Schema } from "mongoose";
import { getModel } from "@/lib/mongooseModel";

export interface IHeroSlide extends Document {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  video?: string;
  order: number;
  isActive: boolean;
  overlayColor?: string;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
    secondaryButtonText: { type: String },
    secondaryButtonLink: { type: String },
    image: { type: String },
    video: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    overlayColor: { type: String, default: "from-navy-dark/90 to-brand-purple/40" },
  },
  { timestamps: true }
);

export default getModel<IHeroSlide>("HeroSlide", HeroSlideSchema);
