import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-charcoal-800 border border-charcoal-700/60 rounded-xl shadow-card ${hover ? 'transition-all duration-300 hover:shadow-elevated hover:border-charcoal-600 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: 'terracotta' | 'olive' | 'sand' | 'red';
}

const accentColors = {
  terracotta: 'text-terracotta-400 bg-terracotta-600/10',
  olive: 'text-olive-400 bg-olive-600/10',
  sand: 'text-sand-400 bg-sand-600/10',
  red: 'text-red-400 bg-red-600/10',
};

export function StatCard({ label, value, icon, trend, trendUp, accent = 'terracotta' }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-display font-bold text-cream-100 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-1.5 ${trendUp ? 'text-olive-400' : 'text-terracotta-400'}`}>{trend}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-lg ${accentColors[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
