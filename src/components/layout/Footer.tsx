import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer id="main-footer" className="bg-[#14161D] text-gray-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      {/* Main Footer Links - Centered Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-5">
          {/* Logo & Brand Name */}
          <div className="flex items-center justify-center gap-3">
            <img
              src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/zayn.jpg"
              alt="Zayn.Fashion Logo"
              className="h-10 sm:h-12 w-10 sm:w-12 rounded-full object-cover border border-amber-500/40 shadow-md"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-white">
              Zayn<span className="text-[#E67E22]">.Fashion</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed font-normal">
            Zayn.Fashion is Bangladesh&apos;s trusted modern shopping destination for luxury fashion, ethnic wear, beauty essentials, and premium lifestyle collections.
          </p>

          {/* Contact Details Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-gray-300">
            <a
              href="tel:+8801575654993"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>+880 1575-654993 / 01304012807</span>
            </a>
            <a
              href="mailto:nayeemislam0227@outlook.com"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>nayeemislam0227@outlook.com</span>
            </a>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
              <span>Banani, Dhaka & Ranks Premium Zayn Tower</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="pt-3 flex flex-col items-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Connect & Follow Us
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                id="footer-facebook-link"
                href="https://www.facebook.com/zaynfashion123"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-blue-400 hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] transition-all text-xs font-semibold group cursor-pointer shadow-xs"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] group-hover:text-white transition-colors" />
                <span>Facebook</span>
              </a>
              <a
                id="footer-youtube-link"
                href="https://www.youtube.com/channel/UCzXJ_lNBO20oxkU6XKmvh4A"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000] text-rose-400 hover:text-white border border-[#FF0000]/30 hover:border-[#FF0000] transition-all text-xs font-semibold group cursor-pointer shadow-xs"
              >
                <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-white transition-colors" />
                <span>YouTube</span>
              </a>
              <a
                id="footer-tiktok-link"
                href="https://tiktok.com/@zayn.fashion1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all text-xs font-semibold group cursor-pointer shadow-xs"
              >
                <span className="font-bold text-xs">♪</span>
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center sm:text-left">
        <p>© 2026 Zayn.Fashion Limited. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400">
          <span className="hover:text-white transition-colors">Security Verified</span>
          <span>•</span>
          <span className="hover:text-white transition-colors">SSL Secured</span>
          <span>•</span>
          <span className="hover:text-white transition-colors">Made with ❤️ in Bangladesh</span>
        </div>
      </div>
    </footer>
  );
};

