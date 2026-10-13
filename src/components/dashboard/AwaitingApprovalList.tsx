import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon } from 'lucide-react';
import type { Order } from '../../types/order';
import type { DataStatus } from '../../types/table';
import { Panel } from '../ui/Panel';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { RxAvailabilityBadge } from '../order/RxAvailabilityBadge';
import { useFormatters } from '../../hooks/useFormatters';
import { getPatient } from '../../utils/lookups';
import { computeBill } from '../../utils/billing';

interface AwaitingApprovalListProps {
  orders: Order[];
  total: number;
  status: DataStatus;
}

export function AwaitingApprovalList({ orders, total, status }: AwaitingApprovalListProps) {
  const fmt = useFormatters();
  return (
    <Panel
      title="Awaiting Approval"
      description={`${total} order${total === 1 ? '' : 's'} in your queue`}
      actions={
      <Link to="/orders/pending-approval" className="text-[12px] font-medium text-primary-ink hover:underline">
          Open queue
        </Link>
      }>
      
      {status === 'loading' ?
      <div className="space-y-3 p-4">
          {Array.from({ length: 4 }).map((_, i) =>
        <Skeleton key={i} className="h-12" />
        )}
        </div> :
      orders.length === 0 ?
      <EmptyState compact icon={CircleCheckIcon} title="Queue is clear" message="No orders are waiting for pharmacist approval." /> :

      <ul className="divide-y divide-line">
          {orders.map((o) =>
        <li key={o.id}>
              <Link
            to={`/orders/pending-approval/${o.id}`}
            className="block px-4 py-2.5 transition-colors duration-100 hover:bg-faint focus-visible:bg-faint focus-visible:outline-none">
            
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold tabular-nums text-ink">{o.id}</span>
                  <span className="text-[13px] font-medium tabular-nums text-ink">{fmt.money(computeBill(o).total)}</span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-[12px] text-muted">
                  <span className="truncate">
                    {getPatient(o.patientId)?.name} · {o.type}
                  </span>
                  <span className="whitespace-nowrap">{fmt.time(o.placedAt)}</span>
                </div>
                <div className="mt-1">
                  <RxAvailabilityBadge order={o} />
                </div>
              </Link>
            </li>
        )}
        </ul>
      }
    </Panel>);

}