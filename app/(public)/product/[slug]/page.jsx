import { notFound } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductGallery from "@/components/ProductGallery";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import { HiOutlineChevronRight } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  await dbConnect();

  // 1. Fetch main product
  const product = await Product.findOne({ slug, status: "active" })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  // 2. Fetch related products (same category, excluding current)
  let relatedProducts = [];
  if (product.category) {
    relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      status: "active"
    })
      .limit(4)
      .populate("category", "name")
      .lean();
  }

  // 3. Format data for Client Components
  const formattedProduct = {
    ...product,
    _id: product._id.toString(),
    category: product.category ? { ...product.category, _id: product.category._id.toString() } : null,
  };

  const formattedRelated = relatedProducts.map(rp => ({
    ...rp,
    _id: rp._id.toString(),
    category: rp.category ? { ...rp.category, _id: rp.category._id.toString() } : null,
  }));

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Elite Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-8 md:mb-12">
          <Link href="/" className="hover:text-gold-600 transition-colors">Gallery</Link>
          <HiOutlineChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-gold-600 transition-colors">Collection</Link>
          {formattedProduct.category && (
            <>
              <HiOutlineChevronRight className="w-3 h-3" />
              <Link href={`/category/${formattedProduct.category.slug}`} className="hover:text-gold-600 transition-colors">
                {formattedProduct.category.name}
              </Link>
            </>
          )}
          <HiOutlineChevronRight className="w-3 h-3" />
          <span className="text-ink dark:text-cream-50 truncate max-w-[200px] sm:max-w-none">{formattedProduct.title}</span>
        </nav>

        {/* Primary Stage block (Gallery + Form) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24">
          
          {/* Left: Interactive Media Gallery */}
          <div className="w-full lg:w-3/5">
            <ProductGallery images={formattedProduct.images} title={formattedProduct.title} />
          </div>

          {/* Right: Purchasing Engine */}
          <div className="w-full lg:w-2/5">
            <ProductForm product={formattedProduct} />
          </div>

        </div>

        <hr className="border-charcoal-100 dark:border-charcoal-700 my-16" />

        {/* Detailed Insight Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          
          {/* The Narrative */}
          <div className="space-y-6">
            <h2 className="font-heading text-3xl font-bold text-ink dark:text-cream-50">The Narrative</h2>
            <div className="prose dark:prose-invert max-w-none prose-p:text-charcoal-500 dark:prose-p:text-charcoal-400 prose-p:leading-relaxed text-sm md:text-base">
              {formattedProduct.description ? (
                <p className="whitespace-pre-line">{formattedProduct.description}</p>
              ) : (
                <p className="italic">No narrative provided for this masterpiece.</p>
              )}
            </div>

            {/* Specifications Matrix */}
            <div className="mt-8 pt-8 border-t border-charcoal-100 dark:border-charcoal-700">
               <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-4">Specifications</h3>
               <div className="grid grid-cols-2 gap-y-4 text-sm text-charcoal-600 dark:text-charcoal-300">
                 <div className="flex flex-col">
                   <span className="font-bold text-ink dark:text-cream-50">Medium</span>
                   <span className="capitalize">{formattedProduct.productType}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="font-bold text-ink dark:text-cream-50">SKU</span>
                   <span className="uppercase tracking-widest text-[10px]">{formattedProduct.sku || "Custom Original"}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Logistics block */}
          <div className="space-y-8 bg-white dark:bg-charcoal-800 p-8 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm">
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-3">Care Instructions</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                {formattedProduct.careInstructions || "Keep away from direct, harsh sunlight and areas of high humidity. Dust lightly with a dry, soft microfiber cloth."}
              </p>
            </div>
            <hr className="border-charcoal-100 dark:border-charcoal-700" />
            <div>
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 mb-3">Secure Shipping & Handling</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
                {formattedProduct.shippingInfo || "Each masterpiece is professionally crated with museum-grade archival materials to ensure perfect condition upon arrival. White-glove delivery available at checkout."}
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Related Products */}
        {formattedRelated.length > 0 && (
          <div className="pt-16 border-t border-charcoal-100 dark:border-charcoal-700">
            <h2 className="font-heading text-4xl font-bold text-ink dark:text-cream-50 mb-12 text-center md:text-left">
              Curator's Suggestions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {formattedRelated.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
