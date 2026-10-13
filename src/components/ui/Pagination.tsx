import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { IconButton } from './IconButton';
import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getPages(page: number, count: number): Array<number | 'gap'> {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = [1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count);
  const sorted = Array.from(new Set(set)).sort((a, b) => a - b);
  const out: Array<number | 'gap'> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, pageSize, total, onPageChange }: PaginationProps) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-2 border-t border-line px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      
      <p className="text-[12px] text-muted">
        Showing <span className="font-medium tabular-nums text-ink">{start}–{end}</span> of{' '}
        <span className="font-medium tabular-nums text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <IconButton size="sm" label="Previous page" icon={ChevronLeftIcon} disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        {getPages(page, pageCount).map((p, i) =>
        p === 'gap' ?
        <span key={`gap-${i}`} className="px-1 text-[12px] text-muted" aria-hidden>
              …
            </span> :

        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`Page ${p}`}
          className={cn(
            'h-7 min-w-[28px] rounded-md px-1.5 text-[12px] font-medium tabular-nums transition-colors duration-150',
            p === page ? 'bg-navy text-white' : 'text-muted hover:bg-canvas hover:text-ink'
          )}>
          
              {p}
            </button>

        )}
        <IconButton
          size="sm"
          label="Next page"
          icon={ChevronRightIcon}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)} />
        
      </div>
    </nav>);

}