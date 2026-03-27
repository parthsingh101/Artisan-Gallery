import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * GET /api/cart
 * Fetch the authenticated user's cart from the database
 */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Cart GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Sync the authenticated user's cart to the database
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await req.json();
    if (!Array.isArray(cart)) {
      return NextResponse.json({ error: "Invalid cart format" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { cart } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Cart POST Error:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
