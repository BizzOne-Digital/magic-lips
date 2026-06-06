import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Offer from "@/models/Offer";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const offers = await Offer.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ offers });
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
    const offer = await Offer.create(data);
    return NextResponse.json({ offer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
