import React from 'react';
import { CheckIcon } from 'lucide-react';
import type { FulfilmentStatus } from '../../types/order';
import { cn } from '../../utils/cn';

const steps: FulfilmentStatus[] = ['Awaiting Packing', 'Packing', 'Ready for Dispatch', 'Out for Delivery', 'Delivered'];

export function FulfilmentProgress({ status }: {status: FulfilmentStatus;}) {
  const current = steps.indexOf(status);
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2" aria-label={`Fulfilment status: ${status}`}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex items-center gap-1">
            <span
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] font-medium',
                done && 'text-success-ink',
                active && 'bg-white text-ink ring-1 ring-line',
                !done && !active && 'text-muted'
              )}
              aria-current={active ? 'step' : undefined}>
              
              {done && <CheckIcon className="h-3 w-3" aria-hidden />}
              {step}
            </span>
            {i < steps.length - 1 && <span className="h-px w-3 bg-line-strong" aria-hidden />}
          </li>);

      })}
    </ol>);

}