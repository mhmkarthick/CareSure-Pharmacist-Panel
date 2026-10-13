import React from 'react';
import { RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title = "Couldn't load this data",
  message = 'The request failed. Check your connection and try again.',
  onRetry,
  compact = false
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-6' : 'px-6 py-14')}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-danger/25 bg-danger-soft text-danger-ink">
        <TriangleAlertIcon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] text-muted">{message}</p>
      {onRetry &&
      <Button className="mt-4" size="sm" icon={RefreshCwIcon} onClick={onRetry}>
          Retry
        </Button>
      }
    </div>);

}