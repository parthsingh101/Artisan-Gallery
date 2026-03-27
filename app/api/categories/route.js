import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).lean();
    
    const formatted = categories.map(c => ({
      ...c,
      _id: c._id.toString()
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
