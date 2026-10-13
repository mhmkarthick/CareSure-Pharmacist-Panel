import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
interface SummaryCardProps {
  label: string;
  value: number;
  to: string;
  icon: BoxIcon;
  hint?: string;
  emphasis?: boolean;
}
export function SummaryCard({
  label,
  value,
  to,
  icon: Icon,
  hint,
  emphasis = false
}: SummaryCardProps) {
  return <Link to={to} className={cn('group flex min-h-[92px] flex-col justify-between rounded-[10px] border p-3.5 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', emphasis ? 'border-primary bg-primary text-white hover:bg-primary-hover' : 'border-line bg-white text-ink hover:border-line-strong')}>
      <div className="flex items-center justify-between gap-2">
        <span className={cn('text-[12px] font-medium', emphasis ? 'text-white' : 'text-muted')}>{label}</span>
        <Icon className={cn('h-4 w-4 shrink-0', emphasis ? 'text-white' : 'text-muted')} aria-hidden />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-[24px] font-semibold leading-none tabular-nums">{value}</span>
        <ArrowUpRightIcon className="h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100" aria-hidden />
      </div>
      {hint && <span className={cn('mt-1 text-[11.5px]', emphasis ? 'text-white' : 'text-muted')}>{hint}</span>}
    </Link>;
}