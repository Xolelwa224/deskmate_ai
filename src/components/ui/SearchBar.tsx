import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-64 bg-charcoal-900/60 border border-charcoal-600/60 rounded-lg text-sm text-cream-100 placeholder-charcoal-500 pl-9 pr-3.5 py-2 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors"
      />
    </div>
  );
}

interface FilterTabsProps {
  tabs: { value: string; label: string; count?: number }[];
  active: string;
  onChange: (v: string) => void;
}

export function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide border-b border-charcoal-700/50">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${active === tab.value ? 'text-terracotta-400 border-terracotta-500' : 'text-charcoal-400 border-transparent hover:text-charcoal-200'}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs ${active === tab.value ? 'text-terracotta-400' : 'text-charcoal-500'}`}>({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {icon && <div className="text-charcoal-600 mb-4">{icon}</div>}
      <h3 className="text-base font-display font-semibold text-cream-100">{title}</h3>
      {description && <p className="text-sm text-charcoal-400 mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
