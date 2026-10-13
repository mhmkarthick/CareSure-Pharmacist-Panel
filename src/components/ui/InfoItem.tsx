import React from 'react';
import { cn } from '../../utils/cn';

interface InfoItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoItem({ label, children, className }: InfoItemProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-[11px] font-medium text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-[13px] text-ink">{children}</dd>
    </div>);

}