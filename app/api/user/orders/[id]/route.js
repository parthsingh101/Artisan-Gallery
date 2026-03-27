import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the specific order. Critically: Ensure it belongs to the requesting user!
    const order = await Order.findOne({ _id: id, userId: user._id }).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found or unauthorized to view" }, { status: 404 });
    }

    // Format for client
    const formattedOrder = {
      ...order,
      _id: order._id.toString(),
      userId: order.userId.toString(),
      items: order.items.map(item => ({
        ...item,
        productId: item.productId.toString()
      }))
    };

    return NextResponse.json({ order: formattedOrder }, { status: 200 });

  } catch (error) {
    console.error("Fetch Specific Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
