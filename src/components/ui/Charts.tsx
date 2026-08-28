interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 180, thickness = 28, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" className="text-charcoal-700/40"
            strokeWidth={thickness}
          />
          {total > 0 && data.map((d, i) => {
            const length = (d.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            );
            offset += length;
            return circle;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-xl font-display font-bold text-cream-100">{centerValue}</span>}
            {centerLabel && <span className="text-[10px] text-charcoal-400 uppercase tracking-wider mt-0.5">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="text-charcoal-300">{d.label}</span>
            <span className="text-cream-100 font-medium tabular-nums ml-auto pl-3">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, maxValue, height = 200, formatValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-charcoal-300">{d.label}</span>
            <span className="text-cream-100 font-medium tabular-nums">{formatValue ? formatValue(d.value) : d.value}</span>
          </div>
          <div className="h-2.5 bg-charcoal-700/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color || '#d96e36' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface GroupedBarChartProps {
  labels: string[];
  series: { name: string; values: number[]; color: string }[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function GroupedBarChart({ labels, series, height = 220, formatValue }: GroupedBarChartProps) {
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-4" style={{ height }}>
        {labels.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-end gap-1 w-full justify-center" style={{ height: height - 30 }}>
              {series.map((s, si) => (
                <div key={si} className="relative group flex-1 max-w-[24px]">
                  <div
                    className="w-full rounded-t transition-all duration-1000 ease-out"
                    style={{ height: `${(s.values[i] / max) * (height - 30)}px`, background: s.color, minHeight: s.values[i] > 0 ? '4px' : '0' }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-cream-100 font-medium whitespace-nowrap pointer-events-none">
                    {formatValue ? formatValue(s.values[i]) : s.values[i]}
                  </div>
                </div>
              ))}
            </div>
            <span className="text-[10px] text-charcoal-400 text-center truncate w-full">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center">
        {series.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-charcoal-300">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  labels: string[];
  values: number[];
  height?: number;
  color?: string;
  formatValue?: (v: number) => string;
}

export function LineChart({ labels, values, height = 200, color = '#d96e36', formatValue }: LineChartProps) {
  const width = 600;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(labels.length - 1, 1);
  const points = values.map((v, i) => ({
    x: i * stepX,
    y: height - 30 - ((v - min) / range) * (height - 50),
  }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1]?.x || 0} ${height - 30} L 0 ${height - 30} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 300 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1="0" y1={30 + p * (height - 50)} x2={width} y2={30 + p * (height - 50)} stroke="currentColor" className="text-charcoal-700/30" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        <path d={areaPath} fill="url(#lineGrad)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-charcoal-300" style={{ fontSize: 10 }}>
              {formatValue ? formatValue(values[i]) : values[i]}
            </text>
          </g>
        ))}
        {labels.map((label, i) => (
          <text key={i} x={i * stepX} y={height - 8} textAnchor="middle" className="fill-charcoal-400" style={{ fontSize: 10 }}>
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
