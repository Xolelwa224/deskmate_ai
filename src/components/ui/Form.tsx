import type { ReactNode } from 'react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, value, onChange, type = 'text', placeholder, required, error, icon }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-charcoal-300 mb-1.5">
          {label} {required && <span className="text-terracotta-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500">{icon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-charcoal-900/60 border rounded-lg text-sm text-cream-100 placeholder-charcoal-500 px-3.5 py-2.5 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors ${icon ? 'pl-10' : ''} ${error ? 'border-red-500/50' : 'border-charcoal-600/60'}`}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
}

export function Textarea({ label, value, onChange, placeholder, required, rows = 3, error }: TextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-charcoal-300 mb-1.5">
          {label} {required && <span className="text-terracotta-400">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full bg-charcoal-900/60 border rounded-lg text-sm text-cream-100 placeholder-charcoal-500 px-3.5 py-2.5 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors resize-y ${error ? 'border-red-500/50' : 'border-charcoal-600/60'}`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export function Select({ label, value, onChange, options, required, placeholder }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-charcoal-300 mb-1.5">
          {label} {required && <span className="text-terracotta-400">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-charcoal-900/60 border border-charcoal-600/60 rounded-lg text-sm text-cream-100 px-3.5 py-2.5 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a8a29e' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface FieldRowProps {
  children: ReactNode;
  cols?: number;
}

export function FieldRow({ children, cols = 2 }: FieldRowProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-4`}>
      {children}
    </div>
  );
}
