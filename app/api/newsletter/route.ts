import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { generateDiscountCode } from "@/lib/utils";
import { sendDiscountEmail } from "@/lib/email";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: "Already subscribed", code: existing.discountCode },
        { status: 200 }
      );
    }

    const discountCode = generateDiscountCode();
    const subscriber = await NewsletterSubscriber.create({
      email: email.toLowerCase(),
      discountCode,
    });

    // Send discount email
    await sendDiscountEmail(email, discountCode);

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully!",
      code: discountCode,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
