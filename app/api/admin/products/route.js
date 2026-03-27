import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import slugify from "slugify";

/**
 * Handle GET request to fetch products with filters and pagination
 */
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const productType = searchParams.get("productType") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build Query
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (productType) query.productType = productType;
    if (status) query.status = status;

    // Fetch Products & Total Count
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Product Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

/**
 * Handle POST request to create a new product
 */
export async function POST(req) {
  try {
    // 1. Authenticate and Authorize (Admin only)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    // 2. Connect to Database
    await dbConnect();

    // 3. Parse Request Body
    const body = await req.json();
    const { 
      title, 
      artistName, 
      category: categoryId, 
      productType, 
      shortDescription, 
      description, 
      price, 
      salePrice, 
      stock, 
      sku, 
      status, 
      tags, 
      images, 
      variants, 
      careInstructions, 
      shippingInfo,
      featured,
      bestseller
    } = body;

    // 4. Basic Validation
    if (!title || !artistName || !categoryId || !price) {
      return NextResponse.json({ error: "Missing required fields: title, artist, category, or price." }, { status: 400 });
    }

    // 5. Check if Category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: "Invalid category selected." }, { status: 400 });
    }

    // 6. Generate Slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 7. Create Product
    const newProduct = await Product.create({
      title,
      slug,
      artistName,
      category: categoryId,
      productType,
      shortDescription,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      stock: Number(stock) || 1,
      sku,
      status: status || 'draft',
      tags: tags || [],
      images: images || [],
      variants: variants || [],
      careInstructions,
      shippingInfo,
      featured: !!featured,
      bestseller: !!bestseller
    });

    return NextResponse.json({ 
      message: "Product created successfully", 
      product: newProduct 
    }, { status: 201 });

  } catch (error) {
    console.error("Product Creation Error:", error);
    
    // Handle Mongoose duplicate key error (for SKU)
    if (error.code === 11000) {
      return NextResponse.json({ error: "A product with this SKU already exists." }, { status: 400 });
    }

    return NextResponse.json({ 
      error: "Failed to create product", 
      details: error.message 
    }, { status: 500 });
  }
}
