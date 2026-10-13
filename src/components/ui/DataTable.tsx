import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { TableSkeleton } from './TableSkeleton';
import { ErrorState } from './ErrorState';
import type { SortState } from '../../hooks/useTableState';
import type { DataStatus } from '../../types/table';

export interface Column<T> {
  key: string;
  header: string;
  sortKey?: string;
  align?: 'left' | 'right' | 'center';
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  status: DataStatus;
  onRetry?: () => void;
  sort?: SortState;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  empty: React.ReactNode;
  mobileCard?: (row: T) => React.ReactNode;
  footer?: React.ReactNode;
  minWidth?: string;
  className?: string;
}

const alignClass = (align?: Column<unknown>['align']) =>
align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  status,
  onRetry,
  sort,
  onSort,
  onRowClick,
  empty,
  mobileCard,
  footer,
  minWidth = 'min-w-[860px]',
  className
}: DataTableProps<T>) {
  const wrapper = cn('overflow-hidden rounded-[10px] border border-line bg-white', className);

  if (status === 'loading') {
    return (
      <div className={wrapper}>
        <TableSkeleton columns={Math.min(columns.length, 7)} />
      </div>);

  }
  if (status === 'error') {
    return (
      <div className={wrapper}>
        <ErrorState onRetry={onRetry} />
      </div>);

  }
  if (rows.length === 0) {
    return <div className={wrapper}>{empty}</div>;
  }

  return (
    <div className={wrapper}>
      <div className={cn('overflow-x-auto', mobileCard && 'hidden md:block')}>
        <table className={cn('w-full text-[12.5px]', minWidth)}>
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-line bg-faint">
            <tr>
              {columns.map((col) => {
                const active = Boolean(sort && col.sortKey && sort.key === col.sortKey);
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                    col.sortKey ? active ? sort?.direction === 'asc' ? 'ascending' : 'descending' : 'none' : undefined
                    }
                    className={cn(
                      'whitespace-nowrap px-3 py-2.5 text-[11.5px] font-medium text-muted first:pl-4 last:pr-4',
                      alignClass(col.align)
                    )}>
                    
                    {col.sortKey && onSort ?
                    <button
                      type="button"
                      onClick={() => onSort(col.sortKey as string)}
                      className={cn('inline-flex items-center gap-1 rounded hover:text-ink', active && 'text-ink')}>
                      
                        {col.header}
                        {active ?
                      sort?.direction === 'asc' ?
                      <ChevronUpIcon className="h-3.5 w-3.5" aria-hidden /> :

                      <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden /> :


                      <ChevronsUpDownIcon className="h-3.5 w-3.5 opacity-50" aria-hidden />
                      }
                      </button> :

                    col.header
                    }
                  </th>);

              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) =>
            <tr
              key={rowKey(row)}
              onClick={
              onRowClick ?
              (e) => {
                if ((e.target as HTMLElement).closest('a,button')) return;
                onRowClick(row);
              } :
              undefined
              }
              className={cn('transition-colors duration-100', onRowClick && 'cursor-pointer hover:bg-faint')}>
              
                {columns.map((col) =>
              <td
                key={col.key}
                className={cn('px-3 py-2.5 align-middle text-ink first:pl-4 last:pr-4', alignClass(col.align), col.className)}>
                
                    {col.render(row)}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {mobileCard &&
      <ul className="divide-y divide-line md:hidden">
          {rows.map((row) =>
        <li key={rowKey(row)}>{mobileCard(row)}</li>
        )}
        </ul>
      }
      {footer}
    </div>);

}