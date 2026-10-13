import React from 'react';
import { XIcon } from 'lucide-react';
import { Button } from './Button';

interface ListToolbarProps {
  search: React.ReactNode;
  children?: React.ReactNode;
  hasActiveFilters: boolean;
  onClear: () => void;
  resultCount: number;
  total: number;
  extra?: React.ReactNode;
}

export function ListToolbar({ search, children, hasActiveFilters, onClear, resultCount, total, extra }: ListToolbarProps) {
  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
        <div className="w-full xl:max-w-[300px]">{search}</div>
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {hasActiveFilters &&
          <Button size="sm" variant="ghost" icon={XIcon} onClick={onClear}>
              Clear filters
            </Button>
          }
        </div>
        <p className="text-[12px] text-muted xl:ml-auto" aria-live="polite">
          {hasActiveFilters ? `${resultCount} of ${total} records` : `${total} records`}
        </p>
      </div>
      {extra}
    </div>);

}