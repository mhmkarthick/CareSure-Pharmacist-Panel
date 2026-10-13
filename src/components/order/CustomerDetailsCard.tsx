import React from 'react';
import { Link } from 'react-router-dom';
import { UserIcon } from 'lucide-react';
import type { Customer } from '../../types/customer';
import type { Order } from '../../types/order';
import { InfoItem } from '../ui/InfoItem';
import { useFormatters } from '../../hooks/useFormatters';

interface CustomerDetailsCardProps {
  customer?: Customer;
  order?: Order;
  title?: string;
  action?: React.ReactNode;
}

export function CustomerDetailsCard({ customer, order, title = 'Order Placed By', action }: CustomerDetailsCardProps) {
  const fmt = useFormatters();
  return (
    <section className="rounded-[10px] border border-line bg-white px-4 py-3" aria-label={title}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
          <UserIcon className="h-4 w-4 text-muted" aria-hidden />
          {title}
        </h2>
        {action}
      </div>
      {customer ?
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
          <InfoItem label="Customer">
            <Link to={`/customers/${customer.id}`} className="font-medium text-primary-ink hover:underline">
              {customer.name}
            </Link>
          </InfoItem>
          <InfoItem label="Contact number">
            <a href={`tel:${customer.phone.replace(/\s/g, '')}`} className="tabular-nums hover:underline">
              {customer.phone}
            </a>
          </InfoItem>
          {order ?
        <>
              <InfoItem label="Order ID">
                <span className="tabular-nums">{order.id}</span>
              </InfoItem>
              <InfoItem label="Order date & time">{fmt.dateTime(order.placedAt)}</InfoItem>
            </> :

        <>
              <InfoItem label="Customer ID">{customer.id}</InfoItem>
              <InfoItem label="Email">{customer.email ?? 'Not provided'}</InfoItem>
            </>
        }
        </dl> :

      <p className="text-[13px] text-muted">Customer record unavailable.</p>
      }
    </section>);

}