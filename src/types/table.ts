export type DataStatus = 'loading' | 'error' | 'ready';

export interface DateRange {
  from: string;
  to: string;
}

export interface SelectOption {
  value: string;
  label: string;
}