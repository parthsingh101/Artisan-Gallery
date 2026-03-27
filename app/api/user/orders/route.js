import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all orders for this user, sorted by newest first
    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Map _id to string for client rendering
    const formattedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      items: order.items.map(item => ({
        ...item,
        productId: item.productId.toString()
      }))
    }));

    return NextResponse.json({ orders: formattedOrders }, { status: 200 });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
