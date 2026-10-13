import React from "react";
import { InboxIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
interface EmptyStateProps {
  icon?: BoxIcon;
  title: string;
  message?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}
export function EmptyState({
  icon: Icon = InboxIcon,
  title,
  message,
  action,
  compact = false,
  className
}: EmptyStateProps) {
  return <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-muted">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 text-[14px] font-semibold text-ink">{title}</p>
      {message && <p className="mt-1 max-w-sm text-[13px] text-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>;
}