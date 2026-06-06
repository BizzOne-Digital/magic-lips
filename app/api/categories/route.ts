import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
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
    if (!data.slug) data.slug = generateSlug(data.name);

    const category = await Category.create(data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
