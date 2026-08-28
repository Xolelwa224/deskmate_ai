import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'terracotta' | 'olive';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-olive-600/15 text-olive-300 border-olive-600/30',
  warning: 'bg-amber-600/15 text-amber-300 border-amber-600/30',
  danger: 'bg-red-600/15 text-red-300 border-red-600/30',
  info: 'bg-sand-600/15 text-sand-300 border-sand-600/30',
  neutral: 'bg-charcoal-600/40 text-charcoal-300 border-charcoal-500/30',
  terracotta: 'bg-terracotta-600/15 text-terracotta-300 border-terracotta-600/30',
  olive: 'bg-olive-600/15 text-olive-300 border-olive-600/30',
};

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 font-medium border rounded-md ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}

export function statusToVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'On Track': 'success',
    'Completed': 'success',
    'Passed': 'success',
    'Accepted': 'success',
    'Resolved': 'success',
    'Active': 'success',
    'Available': 'success',
    'At Risk': 'warning',
    'Attention Required': 'warning',
    'Under Review': 'warning',
    'Low Stock': 'warning',
    'Sent': 'info',
    'In Progress': 'info',
    'Draft': 'neutral',
    'To Do': 'neutral',
    'Planning': 'info',
    'Prospect': 'info',
    'New': 'info',
    'Contacted': 'warning',
    'Reviewed': 'neutral',
    'Delayed': 'danger',
    'Critical': 'danger',
    'Declined': 'danger',
    'Blocked': 'danger',
    'Over Budget': 'danger',
    'Off Track': 'danger',
    'Out of Stock': 'danger',
    'Open': 'danger',
    'Incident Report': 'danger',
    'Safety Observation': 'warning',
    'Quality Check': 'info',
    'Outstanding Defect': 'warning',
    'Ordered': 'info',
    'Mitigated': 'warning',
    'Closed': 'neutral',
    'Inactive': 'neutral',
    'Slight Delay': 'warning',
    'Good': 'success',
    'Under Budget': 'success',
    'Poor': 'danger',
    'Low': 'neutral',
    'Medium': 'warning',
    'High': 'danger',
  };
  return map[status] || 'neutral';
}
