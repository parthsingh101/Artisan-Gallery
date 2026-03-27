export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32 animate-pulse">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Elite Breadcrumbs Skeleton */}
        <div className="h-3 w-64 bg-charcoal-100 dark:bg-charcoal-800 rounded-full mb-8 md:mb-12"></div>

        {/* Primary Stage block (Gallery + Form) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24">
          
          {/* Left: Interactive Media Gallery Skeleton */}
          <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4 md:gap-6 h-full">
             <div className="flex flex-row md:flex-col gap-4 overflow-x-hidden md:w-24 shrink-0">
               {[1, 2, 3].map(i => (
                 <div key={i} className="w-24 h-24 md:w-full md:h-32 rounded-xl bg-charcoal-100 dark:bg-charcoal-800 shrink-0"></div>
               ))}
             </div>
             <div className="flex-1 bg-charcoal-100 dark:bg-charcoal-800 rounded-3xl aspect-[4/5] md:aspect-auto md:h-[70vh]"></div>
          </div>

          {/* Right: Purchasing Engine Skeleton */}
          <div className="w-full lg:w-2/5">
            <div className="h-full bg-white dark:bg-charcoal-800 p-8 rounded-3xl shadow-sm border border-charcoal-100 dark:border-charcoal-700 flex flex-col">
              <div className="h-3 w-32 bg-charcoal-100 dark:bg-charcoal-700 rounded-full mb-4"></div>
              <div className="h-10 w-3/4 bg-charcoal-100 dark:bg-charcoal-700 rounded-2xl mb-6"></div>
              <div className="h-8 w-1/3 bg-charcoal-100 dark:bg-charcoal-700 rounded-xl mb-12"></div>

              <div className="h-[2px] w-full bg-charcoal-100 dark:bg-charcoal-700 mb-12"></div>

              <div className="h-4 w-48 bg-charcoal-100 dark:bg-charcoal-700 rounded-full mb-6"></div>
              <div className="space-y-4 mb-12">
                <div className="h-16 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
                <div className="h-16 w-full bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
              </div>

              <div className="mt-auto flex gap-4 mb-4">
                <div className="w-32 h-14 bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
                <div className="flex-1 h-14 bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
                <div className="w-14 h-14 bg-charcoal-100 dark:bg-charcoal-700 rounded-xl"></div>
              </div>
              <div className="w-full h-14 bg-charcoal-200 dark:bg-charcoal-700 rounded-xl"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
