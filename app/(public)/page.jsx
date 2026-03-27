import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import HomepageSetting from "@/models/HomepageSetting";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/home/ProductGrid";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();

  // Fetch Homepage Settings (Singleton)
  let settings = await HomepageSetting.findOne().lean();
  if (!settings) {
    settings = await HomepageSetting.create({});
  }

  // Fetch Categories
  const categories = await Category.find().sort({ name: 1 }).limit(4).lean();

  // Fetch Spring Collection (Featured Products)
  const springCollection = await Product.find({ 
    status: "active", 
    featured: true 
  })
  .populate("category", "name")
  .sort({ createdAt: -1 })
  .limit(4)
  .lean();

  // Fetch Bestsellers
  const bestsellers = await Product.find({ 
    status: "active", 
    bestseller: true 
  })
  .populate("category", "name")
  .sort({ createdAt: -1 })
  .limit(4)
  .lean();

  // Dynamic Statistics
  const totalArtworksCount = await Product.countDocuments({ status: "active" });
  const uniqueArtistsList = await Product.distinct("artistName", { status: "active" });
  const totalArtistsCount = uniqueArtistsList.length;

  const formatCount = (num) => {
    if (num < 10) return num.toString();
    const base = Math.pow(10, Math.floor(Math.log10(num)));
    const rounded = Math.floor(num / base) * base;
    // e.g., 32 -> Math.floor(32/10)*10 = 30; 180 -> Math.floor(180/100)*100=100.
    // Let's do nearest 10 for numbers < 100, and nearest 50 for 100-1000, but simple 10s is fine based on request.
    const downToTen = Math.floor(num / 10) * 10;
    return `${downToTen}+`;
  };

  const dynamicStats = {
    totalArtworks: formatCount(totalArtworksCount),
    totalArtists: formatCount(totalArtistsCount)
  };

  // Helper to format Mongoose objects for Client Components
  const formatData = (data) => JSON.parse(JSON.stringify(data));

  return (
    <div className="bg-white dark:bg-charcoal-900 transition-colors duration-500 overflow-hidden">
      {/* 1. Hero Section */}
      <Hero settings={formatData(settings)} stats={dynamicStats} />

      {/* 2. Featured Categories */}
      <CategorySection categories={formatData(categories)} />

      {/* 3. Spring Collection (Featured) */}
      <ProductGrid 
        title={settings.featuredTitle || "Spring Collection"} 
        subtitle={settings.featuredSubtitle || "Newly Unveiled"} 
        products={formatData(springCollection)}
        limit={4} 
        columns={4}
      />

      {/* 4. Handcrafted Promise Banner */}
      <PromoBanner settings={formatData(settings)} />

      {/* 5. Bestselling Artworks */}
      <div className="bg-cream-50/30 dark:bg-charcoal-800/20">
        <ProductGrid 
          title={settings.bestsellerTitle || "Bestselling Masterpieces"} 
          subtitle={settings.bestsellerSubtitle || "Collected Globally"} 
          products={formatData(bestsellers)}
          limit={4} 
          columns={4}
        />
      </div>

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Newsletter Signup */}
      <Newsletter />
    </div>
  );
}
