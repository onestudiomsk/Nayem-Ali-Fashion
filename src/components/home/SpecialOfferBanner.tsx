import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Flame, ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';

export const SpecialOfferBanner: React.FC = () => {
  const { navigateTo } = useStore();

  // 48-hour live countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="special-offers-section" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-[#1A1C23] text-white p-7 sm:p-10 lg:p-12 shadow-sm border border-slate-800">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E67E22]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#E67E22]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Offer Details Left */}
          <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E67E22] text-xs font-extrabold tracking-widest uppercase">
              <Flame className="w-4 h-4 text-[#E67E22]" />
              <span>Limited Time Flash Deals</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Up to <span className="text-[#E67E22]">50% OFF</span> Seasonal Specials
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-normal">
              Grab exclusive deals on handcrafted traditional sarees, air fryers, authentic beauty serums, and organic groceries. Limited units available at promotional rates!
            </p>

            {/* Promo Code tag */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
              <span className="text-xs text-gray-400">Use coupon at checkout:</span>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-mono font-bold text-[#E67E22] tracking-wider">
                ZAYN20
              </span>
            </div>
          </div>

          {/* Countdown & Action Right */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-5">
            {/* Live Countdown Clock */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3.5 min-w-[60px] sm:min-w-[70px]">
                <span className="font-heading text-xl sm:text-2xl font-black text-white">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">
                  Days
                </span>
              </div>

              <span className="text-lg font-bold text-gray-500">:</span>

              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3.5 min-w-[60px] sm:min-w-[70px]">
                <span className="font-heading text-xl sm:text-2xl font-black text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">
                  Hours
                </span>
              </div>

              <span className="text-lg font-bold text-gray-500">:</span>

              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3.5 min-w-[60px] sm:min-w-[70px]">
                <span className="font-heading text-xl sm:text-2xl font-black text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">
                  Mins
                </span>
              </div>

              <span className="text-lg font-bold text-gray-500">:</span>

              <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3.5 min-w-[60px] sm:min-w-[70px]">
                <span className="font-heading text-xl sm:text-2xl font-black text-[#E67E22]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mt-0.5">
                  Secs
                </span>
              </div>
            </div>

            {/* Shop Offer Button */}
            <button
              id="special-offer-cta-btn"
              onClick={() => navigateTo('shop', { searchQuery: 'offer' })}
              className="px-7 py-3 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#E67E22]/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Shop All Flash Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

