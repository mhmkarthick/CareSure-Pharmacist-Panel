import type { Preferences } from '../types/preferences';

export const defaultPreferences: Preferences = {
  dateFormat: 'DD MMM YYYY',
  timeFormat: '12h',
  currencyDisplay: 'symbol',
  tableRows: 10,
  startCollapsed: false,
  notifications: {
    orders: true,
    approvals: true,
    doctorReferrals: true,
    callerReferrals: true,
    system: true
  },
  notificationEmail: 'priya.menon@caresure.example',
  sessionTimeout: 30
};