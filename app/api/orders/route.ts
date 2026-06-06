import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderNotification } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const orderNumber = generateOrderNumber();
    const order = await Order.create({ ...data, orderNumber });

    // Send notification email
    await sendOrderNotification({
      orderNumber,
      customer: order.customer,
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress,
    });

    return NextResponse.json({ order, orderNumber }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
