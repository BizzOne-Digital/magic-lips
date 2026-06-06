import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const slide = await HeroSlide.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ slide });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    await HeroSlide.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
