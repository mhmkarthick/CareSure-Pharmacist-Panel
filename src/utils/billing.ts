import type { BillBreakdown, Order } from '../types/order';
import { getMedicine } from './lookups';

export const TAX_RATE = 0.05;

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeBill(order: Pick<Order, 'items' | 'discount' | 'deliveryFee'>): BillBreakdown {
  let subtotal = 0;
  let itemCount = 0;
  order.items.forEach((item) => {
    const med = getMedicine(item.medicineId);
    if (!med) return;
    subtotal += med.price * item.qty;
    itemCount += item.qty;
  });
  const taxable = Math.max(0, subtotal - order.discount);
  const tax = round2(taxable * TAX_RATE);
  return {
    subtotal: round2(subtotal),
    discount: order.discount,
    tax,
    deliveryFee: order.deliveryFee,
    total: round2(taxable + tax + order.deliveryFee),
    itemCount
  };
}

export function amountBand(total: number): 'under-500' | '500-1500' | 'over-1500' {
  if (total < 500) return 'under-500';
  if (total <= 1500) return '500-1500';
  return 'over-1500';
}