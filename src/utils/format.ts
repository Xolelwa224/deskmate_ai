export function formatCurrency(value: number): string {
  if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R${(value / 1000).toFixed(0)}K`;
  return `R${value.toLocaleString('en-ZA')}`;
}

export function formatCurrencyFull(value: number): string {
  return `R${value.toLocaleString('en-ZA')}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export function daysFromNow(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date('2026-08-27');
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateStr: string): boolean {
  return daysFromNow(dateStr) < 0;
}
