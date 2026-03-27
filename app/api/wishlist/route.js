import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product"; 

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).populate("wishlist").lean();
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format products for the client side (ObjectId to string)
    const formattedWishlist = (user.wishlist || []).map(p => ({
      ...p,
      _id: p._id.toString(),
      category: p.category ? p.category.toString() : null
    }));

    return NextResponse.json({ wishlist: formattedWishlist }, { status: 200 });
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Please log in to save to wishlist." }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlistIndex = user.wishlist.findIndex(id => id.toString() === productId);
    let added = false;

    if (wishlistIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(wishlistIndex, 1);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();

    return NextResponse.json({ success: true, added }, { status: 200 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
