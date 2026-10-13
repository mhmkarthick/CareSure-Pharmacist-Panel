import React from 'react';
import type { Order } from '../../types/order';
import { Panel } from '../ui/Panel';
import { InfoItem } from '../ui/InfoItem';
import { StatusBadge } from '../ui/StatusBadge';
import { OrderTypeBadge } from '../ui/OrderTypeBadge';
import { RxAvailabilityBadge } from './RxAvailabilityBadge';
import { useFormatters } from '../../hooks/useFormatters';
import { computeBill } from '../../utils/billing';

export function OrderSummaryCard({ order }: {order: Order;}) {
  const fmt = useFormatters();
  const bill = computeBill(order);
  return (
    <Panel title="Order Summary">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
        <InfoItem label="Order ID">
          <span className="font-medium tabular-nums">{order.id}</span>
        </InfoItem>
        <InfoItem label="Status">
          <StatusBadge status={order.status} />
        </InfoItem>
        <InfoItem label="Order type">
          <OrderTypeBadge type={order.type} />
        </InfoItem>
        <InfoItem label="Prescriptions">
          <RxAvailabilityBadge order={order} />
        </InfoItem>
        <InfoItem label="Placed">{fmt.dateTime(order.placedAt)}</InfoItem>
        <InfoItem label="Last updated">{fmt.dateTime(order.updatedAt)}</InfoItem>
        <InfoItem label="Items">
          {order.items.length} medicines · {bill.itemCount} units
        </InfoItem>
        <InfoItem label="Final payable">
          <span className="text-[15px] font-semibold tabular-nums">{fmt.money(bill.total)}</span>
        </InfoItem>
      </dl>
    </Panel>);

}