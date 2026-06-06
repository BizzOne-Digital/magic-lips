import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { sendContactNotification } from "@/lib/email";
import { isAdminAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { name, email, phone, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message required" }, { status: 400 });
    }

    const contactMessage = await ContactMessage.create({ name, email, phone, message });
    await sendContactNotification({ name, email, phone, message });

    return NextResponse.json({ success: true, id: contactMessage._id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
