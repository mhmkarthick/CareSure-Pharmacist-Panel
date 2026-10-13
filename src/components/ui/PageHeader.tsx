import React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  count?: number;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export function PageHeader({ title, description, count, breadcrumbs, actions, meta }: PageHeaderProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">{title}</h1>
          {count !== undefined &&
          <span className="rounded-md border border-line bg-white px-2 py-0.5 text-[12px] font-medium tabular-nums text-muted">
              {count}
            </span>
          }
        </div>
        {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
        {meta}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>);

}