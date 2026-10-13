import React from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../../types/order';
import type { DataStatus } from '../../types/table';
import { Panel } from '../ui/Panel';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

const segments: Array<{status: OrderStatus;color: string;to: string;}> = [
{ status: 'Pending Approval', color: '#B7791F', to: '/orders/pending-approval' },
{ status: 'Approved', color: '#16865B', to: '/orders/approved' },
{ status: 'Rejected', color: '#C73E4D', to: '/orders/rejected' },
{ status: 'Doctor Review', color: '#2F6FB0', to: '/referrals/doctor' },
{ status: 'Caller Clarification', color: '#94A3B8', to: '/referrals/caller' }];


export function StatusDistribution({ orders, status }: {orders: Order[];status: DataStatus;}) {
  const total = orders.length;
  const data = segments.map((s) => ({ ...s, count: orders.filter((o) => o.status === s.status).length }));
  return (
    <Panel title="Order Status Distribution" description="Where every order currently sits in the workflow">
      {status === 'loading' ?
      <div className="space-y-3 p-4">
          <Skeleton className="h-2.5" />
          {Array.from({ length: 5 }).map((_, i) =>
        <Skeleton key={i} className="h-4" />
        )}
        </div> :
      total === 0 ?
      <EmptyState compact title="No orders yet" message="Distribution appears once orders arrive." /> :

      <div className="p-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-canvas" aria-hidden>
            {data.map((d) =>
          d.count ? <span key={d.status} style={{ width: `${d.count / total * 100}%`, backgroundColor: d.color }} /> : null
          )}
          </div>
          <ul className="mt-3 space-y-0.5">
            {data.map((d) =>
          <li key={d.status}>
                <Link to={d.to} className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-[12.5px] transition-colors duration-100 hover:bg-faint">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} aria-hidden />
                  <span className="flex-1 text-ink">{d.status}</span>
                  <span className="font-medium tabular-nums text-ink">{d.count}</span>
                  <span className="w-10 text-right tabular-nums text-muted">{Math.round(d.count / total * 100)}%</span>
                </Link>
              </li>
          )}
          </ul>
        </div>
      }
    </Panel>);

}