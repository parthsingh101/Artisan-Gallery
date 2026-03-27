import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

async function checkAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") return false;
  return true;
}

export async function GET(req, { params }) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await dbConnect();
    const order = await Order.findById(params.id)
      .populate("userId", "name email")
      .lean();

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const formatted = {
      ...order,
      _id: order._id.toString(),
      userId: order.userId ? { ...order.userId, _id: order.userId._id?.toString() } : null,
      items: order.items.map((item) => ({
        ...item,
        productId: item.productId?.toString(),
      })),
    };
    return NextResponse.json({ order: formatted }, { status: 200 });
  } catch (error) {
    console.error("Admin Order GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const isAdmin = await checkAdmin(req);
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await dbConnect();
    const { orderStatus, paymentStatus } = await req.json();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Paid") {
        order.paidAt = Date.now();
      }
    }

    await order.save();
    return NextResponse.json({ success: true, orderStatus: order.orderStatus, paymentStatus: order.paymentStatus }, { status: 200 });
  } catch (error) {
    console.error("Admin Order PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
