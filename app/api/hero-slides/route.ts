import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const all = isAdminAuthenticated(request);
    const slides = await HeroSlide.find(all ? {} : { isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ slides });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const data = await request.json();
    const slide = await HeroSlide.create(data);
    return NextResponse.json({ slide }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
