import React from 'react';
import { Skeleton } from './Skeleton';

export function TableSkeleton({ rows = 6, columns = 6 }: {rows?: number;columns?: number;}) {
  return (
    <div role="status" aria-label="Loading records">
      <div className="flex gap-4 border-b border-line bg-faint px-4 py-3">
        {Array.from({ length: columns }).map((_, i) =>
        <Skeleton key={i} className="h-3 flex-1" />
        )}
      </div>
      {Array.from({ length: rows }).map((_, r) =>
      <div key={r} className="flex gap-4 border-b border-line px-4 py-3.5 last:border-0">
          {Array.from({ length: columns }).map((_, c) =>
        <Skeleton key={c} className={c === 0 ? 'h-3.5 flex-[1.3]' : 'h-3.5 flex-1'} />
        )}
        </div>
      )}
      <span className="sr-only">Loading…</span>
    </div>);

}