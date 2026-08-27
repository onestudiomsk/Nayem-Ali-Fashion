import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  User,
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmailPassword,
  ADMIN_EMAIL,
  isAuthorizedAdminEmail,
} from '../../lib/auth';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, addToast, navigateTo } = useStore();

  const [authMode, setAuthMode] = useState<'quick' | 'email'>('quick');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setLoading(false);
    setEmailInput('');
    setNameInput('');
    closeAuthModal();
  };

  const handleGoogleAuth = async (forAdmin: boolean = false) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginWithGoogle(forAdmin);
      const userEmail = result.user?.email || (forAdmin ? ADMIN_EMAIL : 'khansakil5612@gmail.com');
      const isTargetAdmin = isAuthorizedAdminEmail(userEmail);

      login(userEmail, isTargetAdmin ? 'admin' : 'customer');

      if (isTargetAdmin) {
        addToast(`Admin access granted for ${userEmail}`, 'success', 'Admin Authenticated');
        navigateTo('admin');
      } else {
        addToast(`Welcome to Zayn.Fashion, ${result.user?.displayName || 'Customer'}!`, 'success');
      }
      handleClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setErrorMessage('Please provide an email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await loginWithEmailPassword(email, 'default_password');
      const isTargetAdmin = isAuthorizedAdminEmail(email);

      login(email, isTargetAdmin ? 'admin' : 'customer');

      if (isTargetAdmin) {
        addToast(`Admin verification successful! Welcome back.`, 'success', 'Admin Authenticated');
        navigateTo('admin');
      } else {
        addToast(`Signed in successfully!`, 'success');
      }
      handleClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        id="auth-modal-dialog"
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1A1C23] to-[#2D3436] p-6 text-white relative">
          <button
            id="auth-modal-close-btn"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <img
              src="https://raw.githubusercontent.com/mskhereiam/nc-image/refs/heads/main/zayn.jpg"
              alt="Zayn.Fashion Logo"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="font-heading font-black text-xl tracking-tight text-white">Zayn<span className="text-[#E67E22]">.Fashion</span></span>
            <span className="ml-auto mr-8 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase flex items-center gap-1 border border-emerald-500/30">
              <UserCheck className="w-3 h-3" /> Secure Auth
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Fast, secure authentication for customer orders and store management
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('quick');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'quick'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Click Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'email'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email / Phone
            </button>
          </div>

          {authMode === 'quick' ? (
            /* 1-Click & Admin Options */
            <div className="space-y-3 pt-1">
              <button
                id="google-signin-btn"
                type="button"
                onClick={() => handleGoogleAuth(false)}
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-slate-200 hover:border-[#E67E22] bg-white hover:bg-orange-50/40 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-sm group cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-[#E67E22] rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-slate-900 group-hover:text-[#E67E22] transition-colors">
                      Continue with Google
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E67E22] group-hover:translate-x-0.5 transition-all ml-auto" />
                  </>
                )}
              </button>

              {/* Quick Admin Direct Sign In Action */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(true)}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Sign in as Admin ({ADMIN_EMAIL})</span>
                </button>
              </div>
            </div>
          ) : (
            /* Email / Phone Form */
            <form onSubmit={handleEmailAuth} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. name@example.com or 01712345678"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Sakil Khan"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#E67E22] focus:ring-2 focus:ring-[#E67E22]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Features Info */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Fast Local Persistence</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero Delay Access</span>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            By continuing, you agree to Zayn.Fashion Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
