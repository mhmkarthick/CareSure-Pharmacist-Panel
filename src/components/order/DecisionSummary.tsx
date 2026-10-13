import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheckIcon, CircleXIcon, StethoscopeIcon, PhoneCallIcon } from 'lucide-react';
import type { Order } from '../../types/order';
import type { Referral } from '../../types/referral';
import { useFormatters } from '../../hooks/useFormatters';
import { StatusBadge } from '../ui/StatusBadge';
import { FulfilmentProgress } from './FulfilmentProgress';
import { referralPath } from '../../utils/workflow';

interface DecisionSummaryProps {
  order: Order;
  activeReferral?: Referral;
}

/** Status-specific outcome banner for approved, rejected and in-referral orders. */
export function DecisionSummary({ order, activeReferral }: DecisionSummaryProps) {
  const fmt = useFormatters();

  if (order.status === 'Approved' && order.approval) {
    return (
      <section aria-label="Approval information" className="rounded-[10px] border border-success/25 bg-success-soft px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-2.5">
            <CircleCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-success-ink" aria-hidden />
            <div>
              <p className="text-[14px] font-semibold text-ink">Approved by {order.approval.by}</p>
              <p className="text-[12px] text-ink/80">
                {fmt.dateTime(order.approval.at)}
                {order.approval.note ? ` · “${order.approval.note}”` : ''}
              </p>
            </div>
          </div>
          {order.fulfilment &&
          <div>
              <p className="mb-1 text-[11px] font-medium text-ink/70">Current fulfilment status</p>
              <FulfilmentProgress status={order.fulfilment} />
            </div>
          }
        </div>
      </section>);

  }

  if (order.status === 'Rejected' && order.rejection) {
    return (
      <section aria-label="Rejection information" className="rounded-[10px] border border-danger/25 bg-danger-soft px-4 py-3">
        <div className="flex items-start gap-2.5">
          <CircleXIcon className="mt-0.5 h-5 w-5 shrink-0 text-danger-ink" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">Rejected — {order.rejection.reason}</p>
            {order.rejection.details && <p className="mt-0.5 text-[13px] text-ink/90">{order.rejection.details}</p>}
            <p className="mt-1.5 text-[12px] text-ink/75">
              Rejected by <span className="font-medium text-ink">{order.rejection.by}</span> on {fmt.dateTime(order.rejection.at)}
            </p>
          </div>
        </div>
      </section>);

  }

  const isDoctor = order.status === 'Doctor Review';
  const Icon = isDoctor ? StethoscopeIcon : PhoneCallIcon;
  return (
    <section aria-label="Workflow stage" className="rounded-[10px] border border-info/25 bg-info-soft px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-info-ink" aria-hidden />
          <div>
            <p className="text-[14px] font-semibold text-ink">
              {isDoctor ? 'With the doctor for medical clarification' : 'With the caller desk for clarification'}
            </p>
            <p className="text-[12px] text-ink/80">
              Pharmacist approval is paused until this referral is returned to the approval queue.
            </p>
          </div>
        </div>
        {activeReferral &&
        <Link
          to={referralPath(activeReferral)}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-info/30 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink hover:border-info/50 sm:self-auto">
          
            {activeReferral.id}
            <StatusBadge status={activeReferral.status} />
          </Link>
        }
      </div>
    </section>);

}