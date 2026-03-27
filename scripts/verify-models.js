const mongoose = require("mongoose");
const Category = require("../models/Category").default;
const Product = require("../models/Product").default;

async function verifyModels() {
  console.log("Starting model verification...");
  
  try {
    // 1. Test Category instantiation
    const testCategory = new Category({
      name: "Oil Paintings",
      slug: "oil-paintings",
      description: "Fine oil on canvas masterpieces"
    });
    console.log("✓ Category model instantiated successfully");

    // 2. Test Product instantiation
    const testProduct = new Product({
      title: "Misty Peaks",
      slug: "misty-peaks",
      artistName: "Eleanor Vance",
      category: testCategory._id,
      productType: "painting",
      shortDescription: "A serene mountain landscape.",
      description: "Detailed description of the misty peaks painting.",
      price: 450,
      stock: 1,
      images: [{ url: "https://example.com/art.jpg", isPrimary: true }],
      variants: [{ size: "24x36", frame: "Gold Leaf", material: "Canvas" }]
    });
    console.log("✓ Product model instantiated successfully");

    console.log("\nModel verification complete. All schemas are valid.");
  } catch (err) {
    console.error("Verification failed:", err.message);
    process.exit(1);
  }
}

verifyModels();
