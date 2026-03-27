import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/ProductCard";
import CategoryFilters from "@/components/CategoryFilters";
import Pagination from "@/components/Pagination";
import { HiOutlineColorSwatch } from "react-icons/hi";

// Revalidate occasionally, or keep dynamic if relying purely on searchParams
export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }) {
  await dbConnect();

  const { slug } = params;

  // 1. Locate the Specific Collection
  const category = await Category.findOne({ slug }).lean();
  
  if (!category) {
    notFound(); // Redirects to Next.js built-in 404 page if category invalid
  }

  // 2. Extract Search Params
  const { search, productType, sort, page = "1" } = searchParams;
  
  // 3. Build Query specific to this category
  const query = { 
    status: "active",
    category: category._id 
  };
  
  if (productType) query.productType = productType;
  
  // Localized Search across Title and Artist
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { artistName: { $regex: search, $options: "i" } }
    ];
  }

  // 4. Build Sort
  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };

  // 5. Pagination Config
  const pageNum = parseInt(page, 10) || 1;
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  // 6. Fetch Data in Parallel
  const [products, totalItems] = await Promise.all([
    Product.find(query)
      .populate("category", "name") // Though we already know the category, good to populate for the card component expectations
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalItems / limit);
  const paginationData = { page: pageNum, limit, total: totalItems, pages: totalPages };

  // Format products to stringify ObjectIds for Client Components
  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    category: p.category ? { ...p.category, _id: p.category._id.toString() } : null
  }));

  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20">
      
      {/* Category Header */}
      <div className="bg-ink dark:bg-black pt-32 pb-24 px-6 md:px-12 relative overflow-hidden flex items-center justify-center">
        {/* Background Image/Gradient layer */}
        {category.image ? (
           <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-ink/80 dark:bg-black/90 z-10"></div>
             <img src={category.image} alt={category.name} className="w-full h-full object-cover blur-sm opacity-50" />
           </div>
        ) : (
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-600 via-transparent to-transparent z-0"></div>
        )}
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <p className="text-gold-500 font-extrabold text-xs uppercase tracking-[0.3em] mb-4">Curated Collection</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-cream-50 mb-6 tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-charcoal-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Localized Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <CategoryFilters />
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
                    We couldn't find any artworks in the '{category.name}' collection matching your current search or refinement criteria. Try broadening your terms.
                  </p>
               </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {formattedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Pagination (Reused from Shop Module) */}
                <Pagination pagination={paginationData} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
