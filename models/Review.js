import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type:     Schema.Types.ObjectId,
      ref:      "Product",
      required: true,
    },
    user: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    rating: {
      type:     Number,
      required: [true, "Rating is required"],
      min:      1,
      max:      5,
    },
    title: {
      type:    String,
      trim:    true,
      maxlength: 100,
    },
    comment: {
      type:     String,
      required: [true, "Review comment is required"],
      trim:     true,
    },
    isVerifiedPurchase: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Each user can only review a product once
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
