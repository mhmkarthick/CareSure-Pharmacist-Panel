import { useMemo } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { formatDate, formatMoney, formatTime } from '../utils/format';

export function useFormatters() {
  const { preferences } = useAppState();
  return useMemo(
    () => ({
      date: (iso: string) => formatDate(iso, preferences.dateFormat),
      time: (iso: string) => formatTime(iso, preferences.timeFormat),
      dateTime: (iso: string) => `${formatDate(iso, preferences.dateFormat)}, ${formatTime(iso, preferences.timeFormat)}`,
      money: (value: number) => formatMoney(value, preferences.currencyDisplay)
    }),
    [preferences.dateFormat, preferences.timeFormat, preferences.currencyDisplay]
  );
}