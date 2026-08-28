import { Building2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export function Logo({ size = 'md', showText = true, light = false }: LogoProps) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className="bg-terracotta-600 rounded-lg p-1.5 shadow-soft">
          <Building2 size={iconSize} className="text-cream-50" strokeWidth={2.2} />
        </div>
      </div>
      {showText && (
        <div className="leading-tight">
          <div className={`font-display font-bold ${textSize} ${light ? 'text-cream-50' : 'text-cream-100'}`}>Xolelwa</div>
          <div className={`text-[10px] tracking-wider uppercase ${light ? 'text-cream-200/70' : 'text-charcoal-400'}`}>BuildConsult</div>
        </div>
      )}
    </div>
  );
}
