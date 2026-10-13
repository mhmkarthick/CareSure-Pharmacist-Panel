import React from 'react';
import { Link } from 'react-router-dom';
import { InfoIcon } from 'lucide-react';
import type { Referral } from '../../types/referral';
import type { Order } from '../../types/order';
import { InfoItem } from '../ui/InfoItem';
import { StatusBadge } from '../ui/StatusBadge';
import { useFormatters } from '../../hooks/useFormatters';

export function ReferralSummaryCard({ referral, order }: {referral: Referral;order?: Order;}) {
  const fmt = useFormatters();
  return (
    <section className="rounded-[10px] border border-line bg-white px-4 py-3" aria-label="Referral information">
      <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <InfoIcon className="h-4 w-4 text-muted" aria-hidden />
        {referral.kind === 'doctor' ? 'Original Referral Reason' : 'Clarification Reason'}
      </h2>
      <p className="text-[13px] font-medium text-ink">{referral.reason}</p>
      {referral.details && <p className="mt-0.5 text-[12.5px] text-ink/85">{referral.details}</p>}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 sm:grid-cols-3">
        <InfoItem label="Related order">
          <Link to={`/orders/${referral.orderId}`} className="font-medium tabular-nums text-primary-ink hover:underline">
            {referral.orderId}
          </Link>
        </InfoItem>
        <InfoItem label="Order status">{order ? <StatusBadge status={order.status} /> : '—'}</InfoItem>
        <InfoItem label="Referred by">{referral.referredBy}</InfoItem>
        <InfoItem label="Referred on">{fmt.dateTime(referral.createdAt)}</InfoItem>
        <InfoItem label="Assigned to">{referral.assignee ?? 'Unassigned'}</InfoItem>
        <InfoItem label="Last updated">{fmt.dateTime(referral.updatedAt)}</InfoItem>
      </dl>
    </section>);

}