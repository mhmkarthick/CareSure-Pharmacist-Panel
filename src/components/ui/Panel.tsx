import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Panel({ title, description, actions, children, className, bodyClassName }: PanelProps) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-[10px] border border-line bg-white', className)}>
      {(title || actions) &&
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0">
            {title && <h2 className="truncate text-[14px] font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 truncate text-[12px] text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      }
      <div className={cn('min-h-0 flex-1', bodyClassName)}>{children}</div>
    </section>);

}