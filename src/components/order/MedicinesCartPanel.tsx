import React from 'react';
import type { Order } from '../../types/order';
import { Panel } from '../ui/Panel';
import { MedicineTable } from './MedicineTable';
import { BillSummary } from './BillSummary';
import { computeBill } from '../../utils/billing';

interface MedicinesCartPanelProps {
  order: Order;
  allergies: string[];
  className?: string;
}

export function MedicinesCartPanel({ order, allergies, className }: MedicinesCartPanelProps) {
  const bill = computeBill(order);
  return (
    <Panel
      title="Medicines Cart"
      description={`${order.items.length} medicine${order.items.length === 1 ? '' : 's'} · ${bill.itemCount} units`}
      className={className}
      bodyClassName="flex flex-col">
      
      <div className="min-h-0 flex-1 overflow-auto">
        <MedicineTable items={order.items} allergies={allergies} />
      </div>
      <div className="shrink-0 rounded-b-[10px] border-t border-line bg-faint px-4 py-3">
        <BillSummary order={order} />
      </div>
    </Panel>);

}