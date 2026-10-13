import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: BreadcrumbItem[];}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-1.5">
      <ol className="flex flex-wrap items-center gap-1 text-[12px] text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.to && !last ?
              <Link to={item.to} className="rounded hover:text-ink hover:underline">
                  {item.label}
                </Link> :

              <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-ink' : undefined}>
                  {item.label}
                </span>
              }
              {!last && <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />}
            </li>);

        })}
      </ol>
    </nav>);

}