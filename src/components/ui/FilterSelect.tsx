import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { SelectOption } from '../../types/table';

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function FilterSelect({ label, value, onChange, options, className }: FilterSelectProps) {
  const active = value !== 'all';
  return (
    <label
      className={cn(
        'relative inline-flex h-9 cursor-pointer items-center rounded-lg border pl-3 pr-8 text-[13px] transition-colors duration-150 focus-within:ring-2 focus-within:ring-primary/30',
        active ? 'border-primary/40 bg-primary-soft' : 'border-line bg-white hover:border-line-strong',
        className
      )}>
      
      <span className="mr-1 whitespace-nowrap text-muted">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[180px] cursor-pointer appearance-none truncate bg-transparent font-medium text-ink outline-none">
        
        {options.map((o) =>
        <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted" aria-hidden />
    </label>);

}