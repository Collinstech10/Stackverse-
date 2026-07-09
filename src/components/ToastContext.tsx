import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = "info", duration = 4000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, type, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => {
    toast({ title, description, type: "success" });
  }, [toast]);

  const error = useCallback((title: string, description?: string) => {
    toast({ title, description, type: "error" });
  }, [toast]);

  const info = useCallback((title: string, description?: string) => {
    toast({ title, description, type: "info" });
  }, [toast]);

  const warning = useCallback((title: string, description?: string) => {
    toast({ title, description, type: "warning" });
  }, [toast]);

  const getIcon = (type?: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 animate-bounce" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-indigo-400 shrink-0" />;
    }
  };

  const getBorderColor = (type?: ToastType) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-950/20";
      case "error":
        return "border-rose-500/30 bg-rose-950/20";
      case "warning":
        return "border-amber-500/30 bg-amber-950/20";
      case "info":
      default:
        return "border-indigo-500/30 bg-indigo-950/20";
    }
  };

  const getGlowColor = (type?: ToastType) => {
    switch (type) {
      case "success":
        return "shadow-[0_0_15px_rgba(16,185,129,0.15)]";
      case "error":
        return "shadow-[0_0_15px_rgba(244,63,94,0.15)]";
      case "warning":
        return "shadow-[0_0_15px_rgba(245,158,11,0.15)]";
      case "info":
      default:
        return "shadow-[0_0_15px_rgba(99,102,241,0.15)]";
    }
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      
      {/* Toast Portals Mount */}
      <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto w-full p-4 rounded-2xl border backdrop-blur-md flex gap-3 items-start justify-between relative overflow-hidden ${getBorderColor(
                item.type
              )} ${getGlowColor(item.type)}`}
            >
              {/* Subtle top edge matching line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  item.type === "success"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                    : item.type === "error"
                    ? "bg-gradient-to-r from-rose-500 to-red-500"
                    : item.type === "warning"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500"
                }`}
              />
              
              <div className="flex gap-3 items-start">
                <div className="mt-0.5">{getIcon(item.type)}</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-100 font-display">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(item.id)}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
