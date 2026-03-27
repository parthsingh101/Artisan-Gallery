import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String, // URL to category thumbnail
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in development
export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
