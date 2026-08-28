import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative w-full ${sizeClasses[size]} max-h-[92vh] sm:max-h-[88vh] bg-charcoal-800 border border-charcoal-700 rounded-t-2xl sm:rounded-2xl shadow-elevated flex flex-col animate-slide-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-700/60 shrink-0">
          <h2 className="text-lg font-display font-bold text-cream-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-4 border-t border-charcoal-700/60 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
