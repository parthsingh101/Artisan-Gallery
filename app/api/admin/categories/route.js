import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import slugify from "slugify";

/**
 * Handle GET request to fetch all categories
 */
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

/**
 * Handle POST request to create a new category
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name, description, image } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if category already exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "A collection with this name already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({
      name,
      slug,
      description,
      image
    });

    return NextResponse.json({ 
      message: "Collection created successfully", 
      category: newCategory 
    }, { status: 201 });

  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}
