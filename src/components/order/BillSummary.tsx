import React from 'react';
import type { Order } from '../../types/order';
import { computeBill, TAX_RATE } from '../../utils/billing';
import { useFormatters } from '../../hooks/useFormatters';

export function BillSummary({ order }: {order: Order;}) {
  const fmt = useFormatters();
  const bill = computeBill(order);
  const row = 'flex items-baseline justify-between gap-3';
  return (
    <dl className="space-y-1.5 text-[12.5px]" aria-label="Bill summary">
      <div className={row}>
        <dt className="text-muted">Subtotal ({bill.itemCount} units)</dt>
        <dd className="tabular-nums text-ink">{fmt.money(bill.subtotal)}</dd>
      </div>
      <div className={row}>
        <dt className="text-muted">Discount</dt>
        <dd className="tabular-nums text-success-ink">{bill.discount > 0 ? `− ${fmt.money(bill.discount)}` : fmt.money(0)}</dd>
      </div>
      <div className={row}>
        <dt className="text-muted">GST ({Math.round(TAX_RATE * 100)}%)</dt>
        <dd className="tabular-nums text-ink">{fmt.money(bill.tax)}</dd>
      </div>
      <div className={row}>
        <dt className="text-muted">Delivery charges</dt>
        <dd className="tabular-nums text-ink">{bill.deliveryFee > 0 ? fmt.money(bill.deliveryFee) : 'Free'}</dd>
      </div>
      <div className={`${row} mt-2 border-t border-line pt-2.5`}>
        <dt className="text-[13px] font-semibold text-ink">Final Payable Amount</dt>
        <dd className="text-[18px] font-semibold tabular-nums text-ink">{fmt.money(bill.total)}</dd>
      </div>
    </dl>);

}