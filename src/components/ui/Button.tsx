import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-terracotta-600 text-cream-50 hover:bg-terracotta-700 shadow-soft border border-terracotta-700/20',
  secondary: 'bg-sand-100 text-charcoal-800 hover:bg-sand-200 border border-sand-300',
  ghost: 'text-charcoal-200 hover:bg-charcoal-700/50 border border-transparent',
  danger: 'bg-red-800/90 text-cream-50 hover:bg-red-900 border border-red-900/20',
  outline: 'border border-sand-400/30 text-sand-100 hover:bg-charcoal-700/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3.5 gap-2.5',
};

export function Button({
  children, onClick, variant = 'primary', size = 'md',
  type = 'button', disabled, className = '', fullWidth,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
