import React from 'react';
import { Link } from 'react-router-dom';
import { InboxIcon } from 'lucide-react';
import type { Referral, ReferralKind } from '../../types/referral';
import type { Order } from '../../types/order';
import type { DataStatus } from '../../types/table';
import { Panel } from '../ui/Panel';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { StatusBadge } from '../ui/StatusBadge';
import { useFormatters } from '../../hooks/useFormatters';
import { getPatient } from '../../utils/lookups';
import { referralPath } from '../../utils/workflow';

interface ReferralMiniListProps {
  kind: ReferralKind;
  referrals: Referral[];
  orders: Order[];
  total: number;
  status: DataStatus;
}

export function ReferralMiniList({ kind, referrals, orders, total, status }: ReferralMiniListProps) {
  const fmt = useFormatters();
  const title = kind === 'doctor' ? 'Doctor Referrals' : 'Caller Referrals';
  const description = kind === 'doctor' ? `${total} awaiting medical clarification` : `${total} awaiting customer clarification`;
  return (
    <Panel
      title={title}
      description={description}
      actions={
      <Link to={`/referrals/${kind}`} className="text-[12px] font-medium text-primary-ink hover:underline">
          View all
        </Link>
      }>
      
      {status === 'loading' ?
      <div className="space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, i) =>
        <Skeleton key={i} className="h-11" />
        )}
        </div> :
      referrals.length === 0 ?
      <EmptyState compact icon={InboxIcon} title={`No open ${kind} referrals`} message="Nothing is waiting on this queue right now." /> :

      <ul className="divide-y divide-line">
          {referrals.map((r) => {
          const order = orders.find((o) => o.id === r.orderId);
          return (
            <li key={r.id}>
                <Link to={referralPath(r)} className="block px-4 py-2.5 transition-colors duration-100 hover:bg-faint focus-visible:bg-faint focus-visible:outline-none">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12.5px] font-semibold tabular-nums text-ink">{r.id}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-0.5 truncate text-[12.5px] text-ink">{r.reason}</p>
                  <p className="truncate text-[11.5px] text-muted">
                    {order ? getPatient(order.patientId)?.name : ''} · {r.orderId} · {fmt.date(r.createdAt)}
                  </p>
                </Link>
              </li>);

        })}
        </ul>
      }
    </Panel>);

}