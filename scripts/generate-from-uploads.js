const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Models
const CategorySchema = new mongoose.Schema({ 
  name: String, 
  slug: String,
  image: String,
  description: String
});
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: String,
  artistName: String,
  category: { type: mongoose.Schema.ObjectId, ref: "Category" },
  productType: { type: String, default: "painting" },
  shortDescription: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 1 },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  sku: String,
  images: [{ url: String, isPrimary: Boolean }],
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const sampleTitles = [
  "Whispers of Dawn", "Echoes in Blue", "The Silent Grove", "Crimson Tide",
  "Urban Cascade", "Ethereal Dreams", "Midnight Serenade", "Golden Fields",
  "Lost in Thought", "The Wandering Soul", "Autumn's Embrace", "Frozen Time",
  "Hidden Pathways", "Sunlit Horizon", "Shadows & Light", "Abstract Illusion",
  "The Last Embrace", "Oceans of Time", "Silent Watcher", "Fading Memories",
  "Vibrant Chaos", "The Inner Peace", "Distant Shores", "Twilight Symphony"
];

const sampleArtists = [
  "Elena Rostova", "Marcus Chen", "Sarah Jenkins", "David O'Connor",
  "Aisha Sharma", "Liam Hughes", "Oliver Bennett", "Sophia Patel"
];

async function seedUserImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // 1. Get all images from public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      console.log("Uploads directory not found.");
      process.exit(1);
    }

    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
    console.log(`Found ${imageFiles.length} images in public/uploads/`);

    // 2. Get currently used images to avoid precise duplicates if possible
    const existingProducts = await Product.find({}, "images title");
    const usedImages = existingProducts.flatMap(p => p.images.map(img => img.url));
    const usedImagesNames = usedImages.map(url => path.basename(url));
    
    let availableImages = imageFiles.filter(f => !usedImagesNames.includes(f));
    console.log(`${availableImages.length} unused images available for new products.`);

    if (availableImages.length === 0) {
       console.log("No new images to turn into products. Re-using some of them to fill the gallery...");
       availableImages = [...imageFiles]; // reuse if all used
    }

    // 3. Ensure we have enough categories
    let categories = await Category.find();
    if (categories.length === 0) {
      console.log("Creating default categories...");
      const newCat = await Category.create({ name: "Contemporary Art", slug: "contemporary-art", description: "Modern masterpieces." });
      categories = [newCat];
    }

    // 4. Create new products
    let createdCount = 0;
    
    // Shuffle the available images
    availableImages = availableImages.sort(() => Math.random() - 0.5);

    for (let i = 0; i < availableImages.length; i++) {
      const fileName = availableImages[i];
      const imageUrl = `/uploads/${fileName}`;

      const title = sampleTitles[i % sampleTitles.length] + (i >= sampleTitles.length ? ` ${i}` : "");
      let slug = generateSlug(title);
      
      // Ensure slug uniqueness
      const existing = await Product.findOne({ slug });
      if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

      const artist = sampleArtists[i % sampleArtists.length];
      const category = categories[i % categories.length];
      const price = Math.floor(Math.random() * 5000) + 500;
      
      // Distribute features
      const isFeatured = i % 5 === 0;
      const isBestseller = i % 7 === 0;

      await Product.create({
        title,
        slug,
        artistName: artist,
        category: category._id,
        shortDescription: `A stunning original piece by ${artist}, capturing emotion and depth.`,
        description: `This exquisite original artwork showcases ${artist}'s mastery of technique and composition. The piece utilizes premium materials to ensure longevity and vibrant color retention for generations. Includes a signed certificate of authenticity.`,
        price,
        stock: 1,
        featured: isFeatured,
        bestseller: isBestseller,
        status: "active",
        sku: `ART-${Date.now()}-${i}`,
        images: [{ url: imageUrl, isPrimary: true }]
      });

      createdCount++;
    }

    console.log(`Successfully created ${createdCount} new products from user uploads!`);
    process.exit(0);

  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedUserImages();
