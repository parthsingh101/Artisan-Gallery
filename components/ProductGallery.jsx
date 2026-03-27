"use client";

import { useState } from "react";
import { HiOutlineZoomIn } from "react-icons/hi";

export default function ProductGallery({ images, title }) {
  // If no images provided, use a placeholder
  const activeImages = images && images.length > 0 ? images : [{ url: "/placeholder-art.jpg", alt: title || "Artwork" }];
  
  // Set the first primary image or the first image as default
  const defaultIdx = activeImages.findIndex(img => img.isPrimary) !== -1 ? activeImages.findIndex(img => img.isPrimary) : 0;
  
  const [activeIdx, setActiveIdx] = useState(defaultIdx);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = activeImages[activeIdx];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 h-full">
      
      {/* Thumbnail Bar */}
      <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0">
        {activeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => { setActiveIdx(idx); setIsZoomed(false); }}
            className={`relative w-24 h-24 md:w-full md:h-32 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
              activeIdx === idx 
                ? "border-gold-500 shadow-md scale-95" 
                : "border-transparent hover:border-charcoal-200 dark:hover:border-charcoal-700 opacity-70 hover:opacity-100"
            }`}
          >
            <img 
              src={img.url} 
              alt={img.alt || `${title} thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Stage */}
      <div className="relative flex-1 bg-charcoal-50 dark:bg-charcoal-900 rounded-3xl overflow-hidden aspect-[4/5] md:aspect-auto md:h-[70vh] group">
        <img 
          src={activeImage.url} 
          alt={activeImage.alt || title} 
          className={`w-full h-full object-contain md:object-cover transition-transform duration-700 ${isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in group-hover:scale-105"}`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        
        {/* Zoom Hint Indicator */}
        <div className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-charcoal-600 dark:text-cream-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm hidden md:flex">
          <HiOutlineZoomIn className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
