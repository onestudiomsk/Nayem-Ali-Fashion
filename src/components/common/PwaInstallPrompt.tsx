import React, { useState, useEffect } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Download, X, Share, PlusSquare, WifiOff, Sparkles, Smartphone, Check } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const { isInstallable, canPromptNative, isInstalled, isIOS, isOnline, triggerInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [hasPromptedOnce, setHasPromptedOnce] = useState(false);

  useEffect(() => {
    const dismissedSession = sessionStorage.getItem('ebundi_pwa_dismissed');
    if (dismissedSession) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ebundi_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (canPromptNative) {
      const success = await triggerInstall();
      if (success) {
        setHasPromptedOnce(true);
      }
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  return (
    <>
      {/* 1. Offline Mode Alert Pill */}
      {!isOnline && (
        <div
          id="pwa-offline-indicator"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <WifiOff className="w-4 h-4 text-amber-400" />
          <span>Offline Mode: You are viewing cached products.</span>
        </div>
      )}

      {/* 2. Floating PWA Install Banner */}
      {!isInstalled && isInstallable && !isDismissed && !hasPromptedOnce && (
        <div
          id="pwa-install-banner"
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 max-w-sm w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom-5"
        >
          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-amber-500/20 border border-amber-500/30">
              <img
                src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/zayn.jpg"
                alt="Zayn.Fashion Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading font-extrabold text-sm text-slate-900 truncate">
                  Install Zayn.Fashion App
                </h4>
                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                Install on your device for lightning-fast shopping & offline access.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Not Now
                </button>
              </div>
            </div>

            {/* Close Cross */}
            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. iOS Safari Add to Home Screen Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-rose-600" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Install on iOS (iPhone / iPad)
                </h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              To install Zayn.Fashion on your Apple iOS device, follow these 2 quick steps in Safari:
            </p>

            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Tap the Share icon <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> in Safari's bottom toolbar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" /> <strong className="text-slate-900">"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Got It</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
