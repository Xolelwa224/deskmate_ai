interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'terracotta' | 'olive' | 'sand' | 'red';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const colorStyles = {
  terracotta: 'bg-terracotta-500',
  olive: 'bg-olive-500',
  sand: 'bg-sand-400',
  red: 'bg-red-500',
};

export function ProgressBar({ value, max = 100, color = 'terracotta', size = 'md', showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = pct >= 100 ? 'bg-olive-500' : pct >= 70 ? colorStyles[color] : pct < 30 ? 'bg-terracotta-500' : colorStyles[color];
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-charcoal-700/60 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-charcoal-300 tabular-nums shrink-0 w-10 text-right">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
