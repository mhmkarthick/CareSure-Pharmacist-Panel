import React from 'react';
import { Link } from 'react-router-dom';

interface MobileRecordCardProps {
  to: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  fields: Array<{label: string;value: React.ReactNode;}>;
}

export function MobileRecordCard({ to, title, subtitle, badge, fields }: MobileRecordCardProps) {
  return (
    <Link to={to} className="block px-4 py-3 transition-colors duration-100 hover:bg-faint">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold tabular-nums text-ink">{title}</p>
          {subtitle && <p className="truncate text-[12px] text-muted">{subtitle}</p>}
        </div>
        {badge}
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {fields.map((f) =>
        <div key={f.label} className="min-w-0">
            <dt className="text-[11px] text-muted">{f.label}</dt>
            <dd className="truncate text-[12px] text-ink">{f.value}</dd>
          </div>
        )}
      </dl>
    </Link>);

}