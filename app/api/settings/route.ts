import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const data = await request.json();
    const settings = await SiteSettings.findOneAndUpdate({}, data, { new: true, upsert: true });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
