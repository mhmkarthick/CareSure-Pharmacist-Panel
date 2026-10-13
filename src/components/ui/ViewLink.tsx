import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

export function ViewLink({ to, label = 'View', srLabel }: {to: string;label?: string;srLabel?: string;}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-1 text-[12px] font-medium text-primary-ink transition-colors duration-150 hover:bg-primary-soft">
      
      {label}
      {srLabel && <span className="sr-only"> {srLabel}</span>}
      <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />
    </Link>);

}