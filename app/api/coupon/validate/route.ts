import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import Offer from "@/models/Offer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    const upperCode = code.toUpperCase();

    // Check newsletter discount codes
    const subscriber = await NewsletterSubscriber.findOne({ discountCode: upperCode });
    if (subscriber) {
      if (subscriber.discountUsed) {
        return NextResponse.json({ error: "Coupon already used" }, { status: 400 });
      }
      return NextResponse.json({
        valid: true,
        discountPercent: 10,
        type: "newsletter",
        message: "10% off applied!",
      });
    }

    // Check offers
    const offer = await Offer.findOne({ couponCode: upperCode, isActive: true });
    if (offer) {
      if (offer.expiresAt && offer.expiresAt < new Date()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }
      if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      return NextResponse.json({
        valid: true,
        discountPercent: offer.type === "percentage" ? offer.discountValue : 0,
        discountFixed: offer.type === "fixed" ? offer.discountValue : 0,
        type: offer.type,
        message: `${offer.title} applied!`,
      });
    }

    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
