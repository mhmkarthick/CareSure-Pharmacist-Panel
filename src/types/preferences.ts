export type DateFormat = 'DD MMM YYYY' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';
export type CurrencyDisplay = 'symbol' | 'code';
export type TableRows = 10 | 15 | 25;
export type DataState = 'ready' | 'loading' | 'empty' | 'error';

export interface NotificationPreferences {
  orders: boolean;
  approvals: boolean;
  doctorReferrals: boolean;
  callerReferrals: boolean;
  system: boolean;
}

export interface Preferences {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currencyDisplay: CurrencyDisplay;
  tableRows: TableRows;
  startCollapsed: boolean;
  notifications: NotificationPreferences;
  notificationEmail: string;
  sessionTimeout: number;
}