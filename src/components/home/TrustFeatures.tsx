import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Banknote } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      description: 'Pay safely at your doorstep after inspecting your tamper-evident package.',
      color: 'bg-[#FFF0E6] text-[#E67E22] border-[#FAD7C1]',
    },
    {
      icon: Truck,
      title: 'Nationwide Express',
      description: 'Express 24-48 hours in Dhaka metro. Safe 3-5 days across all 64 districts.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      description: 'Hassle-free replacement or 100% money refund if not completely satisfied.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic',
      description: 'Curated from verified manufacturers, traditional weavers & certified brands.',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <section id="trust-features-section" className="py-10 bg-[#F8F9FA] border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col items-start gap-4 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${feat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#1A1C23] mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

