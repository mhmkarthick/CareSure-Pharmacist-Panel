import { addMinutes, format, parseISO } from 'date-fns';

/** Local ISO timestamp without timezone, matching the seed data format so values sort as strings. */
export function nowIso(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
}

export function shiftIso(iso: string, minutes: number): string {
  return format(addMinutes(parseISO(iso), minutes), "yyyy-MM-dd'T'HH:mm:ss");
}

export function todayIsoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return format(d, 'yyyy-MM-dd');
}