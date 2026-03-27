import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import slugify from "slugify";
import { deleteImage } from "@/lib/cloudinary";

/**
 * Handle GET request to fetch a single product by ID
 */
export async function GET(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    
    const product = await Product.findById(id).populate("category", "name");
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/**
 * Handle PUT request to update a product
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
    const { title } = body;

    // Optional: Only regenerate slug if title changed
    if (title) {
      const existingProduct = await Product.findById(id);
      if (existingProduct && existingProduct.title !== title) {
        body.slug = slugify(title, { lower: true, strict: true });
        
        // Ensure new slug is unique (excluding self)
        let slug = body.slug;
        let counter = 1;
        while (await Product.findOne({ slug, _id: { $ne: id } })) {
          slug = `${body.slug}-${counter}`;
          counter++;
        }
        body.slug = slug;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

/**
 * Handle DELETE request to remove a product
 */
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // 1. Auth Check (Admin Only)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find the product first to access its images array
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Attempt to delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.publicId) {
          try {
            await deleteImage(img.publicId);
          } catch (imgError) {
            console.error(`Failed to delete image ${img.publicId} from Cloudinary:`, imgError);
            // Continue with product deletion even if image cleanup fails
          }
        }
      }
    }

    // Now securely delete the product from the database
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
