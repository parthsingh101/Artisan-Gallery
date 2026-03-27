import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      lowStockProducts,
      recentOrders,
      recentProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Product.countDocuments({ stock: { $lt: 5 } }),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "name email")
        .lean(),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    return NextResponse.json({
      stats: {
        products: totalProducts,
        orders: totalOrders,
        users: totalUsers,
        revenue: totalRevenue[0]?.total || 0,
        lowStock: lowStockProducts
      },
      recentOrders,
      recentProducts
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
