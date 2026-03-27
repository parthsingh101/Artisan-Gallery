import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    
    // Determine authenticated user
    const session = await getServerSession(authOptions);
    let userId = null;
    if (session && session.user && session.user.email) {
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user) userId = user._id;
    }

    const body = await req.json();
    const { items, shippingAddress, paymentMethod, taxPrice, shippingPrice, subtotal, total } = body;

    // Validate payload
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No order items found" }, { status: 400 });
    }

    // Security check: Validate total price against database products
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) {
        return NextResponse.json({ error: `Product ${item.title} not found in database.` }, { status: 404 });
      }
      
      // Calculate database base price honoring sales
      const basePrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
      const additionalCost = item.variant && item.variant.extraPrice ? item.variant.extraPrice : 0;
      const verifiedItemPrice = basePrice + additionalCost;
      
      calculatedSubtotal += (verifiedItemPrice * item.quantity);
      
      // Stock check simulation here (omitted strict decrement for MVP Demo)
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.title}.` }, { status: 400 });
      }
    }

    let calculatedTotal = calculatedSubtotal + (taxPrice || 0) + (shippingPrice || 0);

    // Minor deviation check (e.g., float precision differences of max 1 currency unit)
    if (Math.abs(calculatedTotal - total) > 1) {
      return NextResponse.json({ error: "Price mismatch. Security validation failed." }, { status: 400 });
    }

    // Determine Paid Status based on Demo Payment types
    const paymentStatus = paymentMethod === "Demo Online Payment" ? "Paid" : "Pending";
    const orderStatus = "Processing";

    const newOrder = await Order.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      subtotal: calculatedSubtotal,
      total: calculatedTotal,
      paymentStatus,
      paidAt: paymentStatus === "Paid" ? Date.now() : null,
      orderStatus
    });
    
    // 10. Clear the user's persistent cart in the database
    if (userId) {
      await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    }

    return NextResponse.json({ 
      success: true, 
      orderId: newOrder._id.toString() 
    }, { status: 201 });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Failed to process order" }, { status: 500 });
  }
}
