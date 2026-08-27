import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 text-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {isError && <XCircle className="w-5 h-5 text-rose-600" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-500" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                  {toast.title}
                </p>
              )}
              <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>

            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const ToastNotificationContainer = ToastNotification;
