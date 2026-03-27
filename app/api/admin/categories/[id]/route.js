import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import slugify from "slugify";

/**
 * Handle PUT request to update a category
 */
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { name, description, image } = body;

    // Build update object
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
      
      // Ensure new slug is unique (excluding self)
      let slug = updateData.slug;
      let counter = 1;
      while (await Category.findOne({ slug, _id: { $ne: id } })) {
        slug = `${updateData.slug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }
    
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    const updatedCategory = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (!updatedCategory) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Collection updated successfully", category: updatedCategory });
  } catch (error) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

/**
 * Handle DELETE request to remove a category
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Optional constraint checking: Prevent deleting categories with active products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete collection. It contains ${productCount} artwork(s). Please reassign or delete them first.` 
      }, { status: 400 });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Collection deleted successfully" });

  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}
