import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Pagination from "@/components/Pagination";
import { HiOutlineColorSwatch } from "react-icons/hi";

// Revalidate occasionally, or keep dynamic if relying purely on searchParams
export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
  await dbConnect();

  // 1. Extract params - Next 15 requires awaiting searchParams
  const params = await searchParams;
  const { category, productType, search, sort, page = "1" } = params;
  
  // 2. Build Query
  const query = { status: "active" };
  if (category) query.category = category;
  if (productType) query.productType = productType;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { artistName: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  // 3. Build Sort
  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  // 4. Pagination Config
  const pageNum = parseInt(page, 10) || 1;
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  // 5. Fetch Data in Parallel
  const [products, totalItems, categories] = await Promise.all([
    Product.find(query).populate("category", "name").sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
    Category.find().sort({ name: 1 }).lean()
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  const paginationData = { page: pageNum, limit, total: totalItems, pages: totalPages };

  // Format categories for client component (converting ObjectIds to strings)
  const formattedCategories = categories.map(c => ({
    ...c,
    _id: c._id.toString()
  }));

  // Format products for client component
  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    category: p.category ? { ...p.category, _id: p.category._id.toString() } : null
  }));

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20">
      
      {/* Page Header */}
      <div className="bg-ink dark:bg-black pt-32 pb-24 px-6 md:px-12 text-center relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-600 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-cream-50 mb-6 tracking-tight">
            Curated <span className="text-gold-500 font-serif italic">Masterpieces</span>
          </h1>
          <p className="text-charcoal-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover extraordinary original artworks from visionary creators. Refine your search to find the perfect addition to your personal collection.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 md:-mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <ShopFilters categories={formattedCategories} />
          </div>

          {/* Product Grid Area */}
          <div className="w-full lg:w-3/4 flex flex-col">
            
            {/* Results Header */}
            <div className="flex items-center justify-between bg-white dark:bg-charcoal-800 p-6 rounded-3xl mb-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700">
               <p className="font-bold text-ink dark:text-cream-50">
                 Showing {formattedProducts.length > 0 ? skip + 1 : 0}-{Math.min(skip + limit, totalItems)} of {totalItems} Artworks
               </p>
            </div>

            {/* Grid */}
            {formattedProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-charcoal-800 rounded-3xl border border-charcoal-100 dark:border-charcoal-700 shadow-sm text-center px-4">
                  <div className="w-24 h-24 bg-charcoal-50 dark:bg-charcoal-900 rounded-full flex items-center justify-center mb-6">
                     <HiOutlineColorSwatch className="w-12 h-12 text-charcoal-300" />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-ink dark:text-cream-50 mb-4">No Masterpieces Found</h3>
                  <p className="text-charcoal-400 max-w-md mx-auto leading-relaxed">
                    We couldn't find any artworks matching your current refinement criteria. Try broadening your search or exploring different mediums.
                  </p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {formattedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination total={totalItems} page={pageNum} limit={limit} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
