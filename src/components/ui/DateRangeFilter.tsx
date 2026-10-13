import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { format, parseISO, startOfMonth } from 'date-fns';
import { cn } from '../../utils/cn';
import { todayIsoDate } from '../../utils/datetime';
import { Button } from './Button';
import type { DateRange } from '../../types/table';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  label?: string;
}

const short = (d: string) => format(parseISO(d), 'dd MMM');

export function DateRangeFilter({ value, onChange, label = 'Date' }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const active = Boolean(value.from || value.to);
  const invalid = Boolean(value.from && value.to && value.from > value.to);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const presets = [
  { label: 'Today', range: { from: todayIsoDate(), to: todayIsoDate() } },
  { label: 'Last 7 days', range: { from: todayIsoDate(-6), to: todayIsoDate() } },
  { label: 'Last 30 days', range: { from: todayIsoDate(-29), to: todayIsoDate() } },
  { label: 'This month', range: { from: format(startOfMonth(new Date()), 'yyyy-MM-dd'), to: todayIsoDate() } }];


  const summary = active ? `${value.from ? short(value.from) : 'Any'} – ${value.to ? short(value.to) : 'Any'}` : 'Any date';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          active ? 'border-primary/40 bg-primary-soft' : 'border-line bg-white hover:border-line-strong'
        )}>
        
        <CalendarIcon className="h-4 w-4 text-muted" aria-hidden />
        <span className="text-muted">{label}:</span>
        <span className="whitespace-nowrap font-medium text-ink">{summary}</span>
        <ChevronDownIcon className="h-4 w-4 text-muted" aria-hidden />
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          id={id}
          role="dialog"
          aria-label={`${label} range`}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-0 z-30 mt-1.5 w-[300px] origin-top-left rounded-lg border border-line bg-white p-3 shadow-lg">
          
            <div className="mb-3 flex flex-wrap gap-1.5">
              {presets.map((p) =>
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(p.range)}
              className="rounded-md border border-line px-2 py-1 text-[12px] font-medium text-ink transition-colors duration-150 hover:bg-canvas">
              
                  {p.label}
                </button>
            )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] font-medium text-muted">
                From
                <input
                type="date"
                value={value.from}
                onChange={(e) => onChange({ ...value, from: e.target.value })}
                className="mt-1 h-8 w-full rounded-md border border-line px-2 text-[12px] text-ink focus:border-primary focus:outline-none" />
              
              </label>
              <label className="text-[11px] font-medium text-muted">
                To
                <input
                type="date"
                value={value.to}
                onChange={(e) => onChange({ ...value, to: e.target.value })}
                className="mt-1 h-8 w-full rounded-md border border-line px-2 text-[12px] text-ink focus:border-primary focus:outline-none" />
              
              </label>
            </div>
            {invalid &&
          <p className="mt-2 text-[12px] text-danger-ink" role="alert">
                The start date must be on or before the end date.
              </p>
          }
            <div className="mt-3 flex justify-between">
              <Button size="sm" variant="ghost" onClick={() => onChange({ from: '', to: '' })} disabled={!active}>
                Clear
              </Button>
              <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}