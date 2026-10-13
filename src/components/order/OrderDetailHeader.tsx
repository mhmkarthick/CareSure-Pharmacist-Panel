import React from 'react';
import type { Order } from '../../types/order';
import { PageHeader } from '../ui/PageHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { OrderTypeBadge } from '../ui/OrderTypeBadge';
import type { BreadcrumbItem } from '../ui/Breadcrumbs';
import { useFormatters } from '../../hooks/useFormatters';

interface OrderDetailHeaderProps {
  order: Order;
  breadcrumbs: BreadcrumbItem[];
  title?: string;
  actions?: React.ReactNode;
}

export function OrderDetailHeader({ order, breadcrumbs, title = 'Order Details', actions }: OrderDetailHeaderProps) {
  const fmt = useFormatters();
  return (
    <PageHeader
      breadcrumbs={breadcrumbs}
      title={title}
      actions={actions}
      meta={
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
          <span className="text-[13px] font-semibold tabular-nums text-ink">{order.id}</span>
          <span aria-hidden>·</span>
          <span>Placed {fmt.dateTime(order.placedAt)}</span>
          <span aria-hidden>·</span>
          <OrderTypeBadge type={order.type} />
          <StatusBadge status={order.status} />
        </div>
      } />);


}