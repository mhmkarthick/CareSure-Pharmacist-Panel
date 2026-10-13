import React from 'react';
import { TriangleAlertIcon } from 'lucide-react';
import type { OrderItem } from '../../types/order';
import { useFormatters } from '../../hooks/useFormatters';
import { getMedicine } from '../../utils/lookups';
import { allergyConflict } from '../../utils/clinical';

interface MedicineTableProps {
  items: OrderItem[];
  allergies?: string[];
}

export function MedicineTable({ items, allergies = [] }: MedicineTableProps) {
  const fmt = useFormatters();
  return (
    <table className="w-full text-[12px]">
      <caption className="sr-only">Medicines in this order</caption>
      <thead className="sticky top-0 z-[1] bg-faint text-[11px] text-muted shadow-[0_1px_0_#E2E8F0]">
        <tr>
          <th scope="col" className="px-4 py-2 text-left font-medium">Medicine</th>
          <th scope="col" className="w-10 px-2 py-2 text-center font-medium">Qty</th>
          <th scope="col" className="px-2 py-2 text-right font-medium">Unit Price</th>
          <th scope="col" className="px-4 py-2 text-right font-medium">Total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {items.map((item) => {
          const med = getMedicine(item.medicineId);
          if (!med) return null;
          const conflict = allergyConflict(med, allergies);
          return (
            <tr key={item.medicineId} className={conflict ? 'bg-danger-soft/60' : undefined}>
              <td className="px-4 py-2.5 align-top">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] font-medium text-ink">{med.name}</span>
                  {med.rxOnly &&
                  <span className="rounded border border-line bg-white px-1 text-[11px] font-semibold leading-4 text-muted" title="Prescription-only medicine">
                      Rx
                    </span>
                  }
                </div>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  {med.strength} · {med.form} · {med.pack}
                </p>
                {conflict &&
                <p className="mt-1 flex items-center gap-1 text-[11.5px] font-medium text-danger-ink">
                    <TriangleAlertIcon className="h-3 w-3 shrink-0" aria-hidden />
                    Matches recorded allergy: {conflict}
                  </p>
                }
              </td>
              <td className="px-2 py-2.5 text-center align-top tabular-nums">{item.qty}</td>
              <td className="whitespace-nowrap px-2 py-2.5 text-right align-top tabular-nums text-muted">{fmt.money(med.price)}</td>
              <td className="whitespace-nowrap px-4 py-2.5 text-right align-top font-medium tabular-nums">{fmt.money(med.price * item.qty)}</td>
            </tr>);

        })}
      </tbody>
    </table>);

}