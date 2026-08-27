import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, products, navigateTo } = useStore();

  return (
    <section id="categories-section" className="py-10 sm:py-14 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E67E22] font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Departments</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1C23] tracking-tight">
              Shop by Department
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Curated collections for fashion, kids & sports, accessories, and beauty care.
            </p>
          </div>

          <button
            id="view-all-departments-btn"
            onClick={() => navigateTo('shop')}
            className="text-xs sm:text-sm font-bold text-[#E67E22] hover:text-[#D35400] flex items-center gap-1.5 group self-start sm:self-auto cursor-pointer"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Category Grid Layout matching 16:9 Image Proportions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => navigateTo('shop', { categoryId: cat.id })}
              className="group relative rounded-3xl bg-white border border-gray-200/90 hover:border-[#E67E22]/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden p-3.5 sm:p-4.5 flex flex-col justify-between"
            >
              {/* 16:9 Aspect Ratio Dedicated Image Box */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle soft gradient highlight at the bottom of the image box */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Details Section */}
              <div className="pt-3.5 px-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-[#1A1C23] group-hover:text-[#E67E22] transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E67E22] text-gray-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-normal">
                  {cat.tagline}
                </p>

                {/* Popular Subcategories Chips */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100 flex-wrap">
                  {cat.popularSubcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-[#E67E22] px-2 py-0.5 rounded-md transition-colors"
                    >
                      {sub}
                    </span>
                  ))}
                  {cat.popularSubcategories.length > 3 && (
                    <span className="text-[10px] font-bold text-gray-400">
                      +{cat.popularSubcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

