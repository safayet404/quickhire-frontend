'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const CONFIGS = {
    success: { icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
    error: { icon: XCircle, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    warning: { icon: AlertCircle, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    info: { icon: Info, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
};

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const add = useCallback((type: ToastType, message: string) => {
        const id = ++nextId;
        setToasts(t => [...t, { id, type, message }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    }, []);

    const remove = (id: number) => setToasts(t => t.filter(x => x.id !== id));

    const value: ToastContextValue = {
        success: (msg) => add('success', msg),
        error: (msg) => add('error', msg),
        warning: (msg) => add('warning', msg),
        info: (msg) => add('info', msg),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast container */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
                {toasts.map(toast => {
                    const cfg = CONFIGS[toast.type];
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={toast.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: cfg.bg, border: `1px solid ${cfg.border}`,
                                borderRadius: '12px', padding: '12px 16px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                                minWidth: '280px', maxWidth: '380px',
                                pointerEvents: 'all',
                                animation: 'slideIn 0.2s ease',
                            }}
                        >
                            <Icon size={18} color={cfg.color} style={{ flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#1A1A2E' }}>{toast.message}</span>
                            <button onClick={() => remove(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', color: '#9CA3AF', flexShrink: 0 }}>
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}