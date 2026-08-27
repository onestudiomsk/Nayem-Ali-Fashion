import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Nusrat Jahan',
      role: 'Fashion Designer, Dhaka',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      rating: 5,
      comment:
        'The Dhakai Jamdani saree I ordered from Zayn.Fashion is phenomenal! The fabric quality and weaving details match top heritage boutiques at half the price.',
      product: 'Handcrafted Jamdani Silk Saree',
    },
    {
      name: 'Tanvir Hossain',
      role: 'Software Architect, Gulshan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      rating: 5,
      comment:
        'Zayn.Fashion’s delivery in Dhaka took less than 24 hours. The panjabi fit is sharp and comfortable, and cash on delivery was super smooth.',
      product: 'Royal Jacquard Silk Panjabi',
    },
    {
      name: 'Dr. Anisur Rahman',
      role: 'Physician, Uttara',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      rating: 5,
      comment:
        'Finding genuine designer collections and original luxury accessories online can be tricky, but Zayn.Fashion delivers authentic premium items every time.',
      product: 'Premium Swiss Automatic Chronograph Watch',
    },
  ];

  return (
    <section id="testimonials-section" className="py-12 sm:py-16 bg-[#F8F9FA] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E67E22]">
            Verified Feedback
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1A1C23] tracking-tight mt-1">
            Loved by 50,000+ Customers Across Bangladesh
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal">
            Read verified experiences from real customers who shop with Zayn.Fashion every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic mb-5">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-[#1A1C23] truncate">{t.name}</p>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-gray-400">{t.role}</p>
                  <p className="text-[10px] text-[#E67E22] font-semibold truncate mt-0.5">
                    Purchased: {t.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

