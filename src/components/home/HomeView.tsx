import React from 'react';
import { HeroBanner } from './HeroBanner';
import { CategoryGrid } from './CategoryGrid';
import { ProductGridSection } from './ProductGridSection';

export const HomeView: React.FC = () => {
  return (
    <div id="zayn-fashion-homepage" className="space-y-4">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Grid (Kids & Toys, Women Fashion, Beauty & Care, Home Appliances, Home Decor, Daily Products) */}
      <CategoryGrid />

      {/* 3. Best Sellers Products Grid */}
      <ProductGridSection
        type="bestsellers"
        title="Zayn.Fashion Best Sellers"
        subtitle="Verified highest rated favorites with maximum customer reviews across Bangladesh"
        limit={8}
      />

      {/* 4. All Products Grid */}
      <ProductGridSection
        type="all"
        title="All Products"
        subtitle="Explore our complete catalog of authentic products across all categories"
        limit={12}
      />
    </div>
  );
};
