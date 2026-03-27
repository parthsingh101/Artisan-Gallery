import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    artistName: {
      type: String,
      required: [true, "Please provide an artist name"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["painting", "sketch"],
      default: "painting",
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    salePrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 1, // Most original art is quantity 1
    },
    sku: {
      type: String,
      unique: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    tags: [String],
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variants: [
      {
        size: { type: String }, // e.g., 24x36 inches
        frame: { type: String }, // e.g., Gold Leaf, Natural Wood, None
        material: { type: String }, // e.g., Canvas, Acid-free Paper
        extraPrice: { type: Number, default: 0 },
        stock: { type: Number, default: 1 },
      },
    ],
    careInstructions: {
      type: String,
    },
    shippingInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
ProductSchema.index({ title: "text", artistName: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
