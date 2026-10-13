import React from 'react';
import { PillIcon, FileUpIcon, StethoscopeIcon } from 'lucide-react';
import type { OrderType } from '../../types/order';

const icons = { OTC: PillIcon, 'Upload Prescription': FileUpIcon, 'Add Rx': StethoscopeIcon };

export function OrderTypeBadge({ type }: {type: OrderType;}) {
  const Icon = icons[type];
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[12px] text-ink">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
      {type}
    </span>);

}