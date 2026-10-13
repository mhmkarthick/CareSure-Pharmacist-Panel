import React from 'react';
import { FileCheckIcon, FileTextIcon, FileXIcon, FileImageIcon } from 'lucide-react';
import type { Order } from '../../types/order';
import { rxAvailability } from '../../utils/clinical';

export function RxAvailabilityBadge({ order }: {order: Order;}) {
  const availability = rxAvailability(order);
  const config = {
    both: { icon: FileCheckIcon, label: 'Uploaded + Doctor Rx', className: 'text-success-ink' },
    doctor: { icon: FileTextIcon, label: 'Doctor Rx', className: 'text-info-ink' },
    uploaded: { icon: FileImageIcon, label: 'Uploaded only', className: 'text-warning-ink' },
    none: {
      icon: FileXIcon,
      label: order.type === 'OTC' ? 'Not required (OTC)' : 'Missing',
      className: order.type === 'OTC' ? 'text-muted' : 'text-danger-ink'
    }
  }[availability];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap text-[12px] font-medium ${config.className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {config.label}
    </span>);

}