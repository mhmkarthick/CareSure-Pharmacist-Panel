import React from 'react';
import { Skeleton } from './Skeleton';

export function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading record" className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-3 w-80" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Skeleton className="h-[92px] rounded-[10px]" />
        <Skeleton className="h-[92px] rounded-[10px]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-[460px] rounded-[10px]" />
        <Skeleton className="h-[460px] rounded-[10px]" />
        <Skeleton className="h-[460px] rounded-[10px]" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>);

}