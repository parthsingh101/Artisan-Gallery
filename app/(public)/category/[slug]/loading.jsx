import { HiOutlineSearch } from "react-icons/hi";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 animate-pulse">
      
      {/* Skeleton Category Header (Larger than Shop Header) */}
      <div className="bg-ink dark:bg-black pt-32 pb-24 px-6 md:px-12 text-center relative overflow-hidden h-[400px] flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
          <div className="h-4 w-32 bg-charcoal-800 rounded-full mb-6"></div>
          <div className="h-20 w-3/4 md:w-1/2 bg-charcoal-800 rounded-3xl mb-8"></div>
          <div className="h-4 w-full md:w-2/3 bg-charcoal-800 rounded-full mt-2"></div>
          <div className="h-4 w-1/2 bg-charcoal-800 rounded-full mt-3"></div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Skeleton Localized Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 shadow-sm border border-charcoal-100 dark:border-charcoal-700 h-[600px]">
              <div className="h-6 w-1/2 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg mb-8"></div>
              
              <div className="space-y-4 mb-8">
                <div className="h-4 w-1/3 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg"></div>
                <div className="h-12 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="h-4 w-1/3 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg"></div>
                <div className="h-10 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
                <div className="h-10 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
              </div>

              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg"></div>
                <div className="h-10 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Product Grid Area */}
          <div className="w-full lg:w-3/4 flex flex-col">
            
            {/* Skeleton Results Header */}
            <div className="bg-white dark:bg-charcoal-800 h-16 rounded-3xl mb-8 shadow-sm border border-charcoal-100 dark:border-charcoal-700"></div>

            {/* Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col bg-white dark:bg-charcoal-800 rounded-3xl overflow-hidden shadow-sm border border-charcoal-100 dark:border-charcoal-700">
                  <div className="aspect-[4/5] bg-charcoal-100 dark:bg-charcoal-700"></div>
                  <div className="p-6">
                    <div className="h-3 w-1/3 bg-charcoal-100 dark:bg-charcoal-700 rounded-full mb-3"></div>
                    <div className="h-6 w-3/4 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg mb-4"></div>
                    <div className="h-4 w-1/2 bg-charcoal-100 dark:bg-charcoal-700 rounded-full"></div>
                    <div className="mt-8 h-6 w-1/4 bg-charcoal-100 dark:bg-charcoal-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
