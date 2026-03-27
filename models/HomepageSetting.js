import mongoose from "mongoose";

const HomepageSettingSchema = new mongoose.Schema(
  {
    // Hero Section
    heroTitle: { type: String, default: "Artisan Gallery" },
    heroSubtitle: { type: String, default: "Original Masterpieces & Sketches" },
    heroImage: { type: String }, // Custom Upload or URL
    heroButtonText: { type: String, default: "Shop Collection" },
    heroButtonLink: { type: String, default: "/shop" },

    // Spring Collection (Featured)
    featuredTitle: { type: String, default: "Spring Collection" },
    featuredSubtitle: { type: String, default: "Newly Unveiled" },
    
    // Bestsellers
    bestsellerTitle: { type: String, default: "Bestselling Masterpieces" },
    bestsellerSubtitle: { type: String, default: "Collected Globally" },

    // Custom Banners Or Branding
    promoTitle: { type: String, default: "The Handcrafted Promise" },
    promoSubtitle: { type: String, default: "Every brushstroke tells a story of dedication and legacy." },
    promoImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.HomepageSetting || mongoose.model("HomepageSetting", HomepageSettingSchema);
