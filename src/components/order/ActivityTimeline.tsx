import React from 'react';
import { CpuIcon, PhoneIcon, PillIcon, StethoscopeIcon, UserIcon } from 'lucide-react';
import type { ActorRole } from '../../types/order';
import { useFormatters } from '../../hooks/useFormatters';
import { EmptyState } from '../ui/EmptyState';

export interface TimelineEvent {
  id: string;
  at: string;
  actor: string;
  role: ActorRole;
  action: string;
  note?: string;
}

const roleIcons = { Customer: UserIcon, System: CpuIcon, Caller: PhoneIcon, Doctor: StethoscopeIcon, Pharmacist: PillIcon };

interface ActivityTimelineProps {
  events: TimelineEvent[];
  emptyMessage?: string;
}

export function ActivityTimeline({ events, emptyMessage = 'No activity recorded yet.' }: ActivityTimelineProps) {
  const fmt = useFormatters();
  if (events.length === 0) return <EmptyState compact title="No history" message={emptyMessage} />;
  const ordered = [...events].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <ol className="relative">
      {ordered.map((ev, i) => {
        const Icon = roleIcons[ev.role];
        const last = i === ordered.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && <span className="absolute bottom-0 left-[13px] top-7 w-px bg-line" aria-hidden />}
            <span className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-white text-muted">
              <Icon className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-medium text-ink">{ev.action}</p>
              <p className="text-[11.5px] text-muted">
                {ev.actor} · {ev.role} · <time dateTime={ev.at}>{fmt.dateTime(ev.at)}</time>
              </p>
              {ev.note && <p className="mt-1 rounded-md bg-faint px-2 py-1 text-[12px] text-ink">{ev.note}</p>}
            </div>
          </li>);

      })}
    </ol>);

}