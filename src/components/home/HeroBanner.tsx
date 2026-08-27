import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, ShoppingBag, Flame } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section id="hero-banner-section" className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Flagship Hero Bento Card */}
        <div className="lg:col-span-7 bg-radial from-[#242731] via-[#16181F] to-[#0D0F14] rounded-3xl p-7 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-2xl border border-amber-500/20 group">
          {/* High Fashion Editorial Background Accent */}
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
            alt="Luxury Fashion"
            referrerPolicy="no-referrer"
            className="absolute right-0 top-0 w-full sm:w-2/3 h-full object-cover object-center opacity-25 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 pointer-events-none mix-blend-luminosity"
          />
          
          {/* Multi-layered Luxury Radial Glows */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-gradient-to-tr from-[#E67E22]/30 via-amber-400/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-60 h-60 bg-amber-600/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0F14] via-[#0D0F14]/90 to-transparent sm:w-3/4 pointer-events-none" />
          
          {/* Subtle Decorative Atelier Luxury Seal */}
          <div className="absolute right-6 top-6 w-28 h-28 sm:w-36 sm:h-36 bg-amber-500/5 border border-amber-400/20 rounded-full hidden sm:flex flex-col items-center justify-center pointer-events-none backdrop-blur-[2px] shadow-inner shadow-amber-500/10">
            <span className="text-amber-400/80 text-[10px] font-mono tracking-[0.25em] uppercase font-semibold">
              ATELIER
            </span>
            <span className="w-8 h-[1px] bg-amber-400/40 my-1"></span>
            <span className="text-white/60 text-[8px] tracking-[0.3em] uppercase">
              EST. 2026
            </span>
          </div>

          <div className="relative z-10">
            {/* Top Luxury Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-[0.18em] mb-4 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Haute Couture & Heritage 2026</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight mt-1">
              Elevate Your<br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-[#E67E22] bg-clip-text text-transparent drop-shadow-sm">
                Luxury Signature
              </span>
              <span className="text-[#E67E22]">.</span>
            </h1>

            <p className="text-slate-300 mt-4 max-w-lg text-xs sm:text-sm leading-relaxed font-normal">
              Immerse yourself in authentic designer panjabis, handcrafted sharees, artisanal accessories, and bespoke beauty essentials. Curated exclusively for discerning connoisseurs.
            </p>
          </div>

          {/* Action CTAs & Bottom Metrics */}
          <div className="relative z-10 pt-6">
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                id="hero-shop-now-btn"
                onClick={() => navigateTo('shop')}
                className="bg-gradient-to-r from-[#E67E22] via-[#F39C12] to-[#D35400] text-white px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-[#E67E22]/30 hover:shadow-[#E67E22]/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer border border-amber-300/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Luxury Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-categories-btn"
                onClick={() => {
                  const el = document.getElementById('categories-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/5 text-white/90 border border-white/20 hover:border-amber-400/50 hover:text-white px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer shadow-sm"
              >
                <span>Curated Departments</span>
              </button>
            </div>

            {/* Quick Luxury Trust Metrics */}
            <div className="pt-6 mt-7 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-white block tracking-tight">100% Authentic</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Certified Originals</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-amber-300 block tracking-tight">Artisanal Quality</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Handcrafted Detail</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base text-emerald-300 block tracking-tight">VIP Express</span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Bento Grid Tiles */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Bento Tile 1: Kids Wear */}
          <div
            id="hero-tile-kids"
            onClick={() => navigateTo('shop', { categoryId: 'kids' })}
            className="relative rounded-3xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 group flex-1 min-h-[195px] bg-[#12141A] border border-amber-500/20 hover:border-amber-400/40"
          >
            <img
              src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/kids.jpg"
              alt="Kids Wear"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12]/90 via-[#0B0D12]/40 to-transparent pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30 shadow-xs">
                HOT CURATION
              </span>
            </div>
            <div className="relative z-10 text-white">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-xs flex items-center justify-between">
                <span>Kids Wear</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-500/20 border border-white/15 group-hover:border-amber-400/40 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 text-white group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium drop-shadow-xs">From ৳450 • Designer sets, festive wear & playful dresses</p>
            </div>
          </div>

          {/* Bento Tile 2: Beauty */}
          <div
            id="hero-tile-beauty"
            onClick={() => navigateTo('shop', { categoryId: 'beauty' })}
            className="relative rounded-3xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 group flex-1 min-h-[195px] bg-[#12141A] border border-amber-500/20 hover:border-rose-400/40"
          >
            <img
              src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/beauty.jpg"
              alt="Beauty & Cosmetics"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12]/90 via-[#0B0D12]/40 to-transparent pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-rose-400/30 shadow-xs">
                POPULAR ATELIER
              </span>
            </div>
            <div className="relative z-10 text-white">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-rose-300 transition-colors drop-shadow-xs flex items-center justify-between">
                <span>Beauty & Cosmetics</span>
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-rose-500/20 border border-white/15 group-hover:border-rose-400/40 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 text-white group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium drop-shadow-xs">100% Authentic Serums, Makeup & Luxury Fragrances</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

