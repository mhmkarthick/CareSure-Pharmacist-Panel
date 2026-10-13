import { format, parseISO } from 'date-fns';
import type { CurrencyDisplay, DateFormat, TimeFormat } from '../types/preferences';

const dateTokens: Record<DateFormat, string> = {
  'DD MMM YYYY': 'dd MMM yyyy',
  'DD/MM/YYYY': 'dd/MM/yyyy',
  'MM/DD/YYYY': 'MM/dd/yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd'
};

export function formatDate(iso: string, fmt: DateFormat): string {
  return format(parseISO(iso), dateTokens[fmt]);
}

export function formatTime(iso: string, tf: TimeFormat): string {
  return format(parseISO(iso), tf === '12h' ? 'h:mm a' : 'HH:mm');
}

export function formatMoney(value: number, display: CurrencyDisplay): string {
  const n = value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return display === 'symbol' ? `₹${n}` : `INR ${n}`;
}

export function initials(name: string): string {
  return name.
  replace(/^Dr\.\s*/, '').
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase()).
  join('');
}

export function errorMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
  return e instanceof Error ? e.message : fallback;
}