import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const query: Record<string, unknown> = { isActive: true };
    if (category && category !== "all") query.category = category;
    if (featured === "true") query.isFeatured = true;

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Products GET error:", error);
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

    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    if (!data.sku) {
      data.sku = `ML-${Date.now()}`;
    }

    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
