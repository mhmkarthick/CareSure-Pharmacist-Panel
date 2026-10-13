import React from "react";
import { ClockIcon, CircleCheckIcon, CircleXIcon, StethoscopeIcon, PhoneCallIcon, EyeIcon, MessageSquareTextIcon, Undo2Icon, PackageIcon, PackageCheckIcon, TruckIcon, CircleDotIcon, FlagIcon, CircleMinusIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
type Tone = 'warning' | 'success' | 'danger' | 'info' | 'neutral' | 'primary';
const toneClasses: Record<Tone, string> = {
  warning: 'bg-warning-soft text-warning-ink border-warning/25',
  success: 'bg-success-soft text-success-ink border-success/25',
  danger: 'bg-danger-soft text-danger-ink border-danger/25',
  info: 'bg-info-soft text-info-ink border-info/25',
  neutral: 'bg-canvas text-muted border-line',
  primary: 'bg-primary-soft text-primary-ink border-primary/25'
};
const statusMap: Record<string, {
  tone: Tone;
  icon: BoxIcon;
}> = {
  'Pending Approval': {
    tone: 'warning',
    icon: ClockIcon
  },
  Approved: {
    tone: 'success',
    icon: CircleCheckIcon
  },
  Rejected: {
    tone: 'danger',
    icon: CircleXIcon
  },
  'Doctor Review': {
    tone: 'info',
    icon: StethoscopeIcon
  },
  'Caller Clarification': {
    tone: 'neutral',
    icon: PhoneCallIcon
  },
  'Pending Review': {
    tone: 'warning',
    icon: ClockIcon
  },
  'In Review': {
    tone: 'info',
    icon: EyeIcon
  },
  Responded: {
    tone: 'success',
    icon: MessageSquareTextIcon
  },
  'Returned for Pharmacist Review': {
    tone: 'primary',
    icon: Undo2Icon
  },
  Pending: {
    tone: 'warning',
    icon: ClockIcon
  },
  'In Progress': {
    tone: 'info',
    icon: PhoneCallIcon
  },
  'Clarification Completed': {
    tone: 'success',
    icon: CircleCheckIcon
  },
  'Returned to Workflow': {
    tone: 'primary',
    icon: Undo2Icon
  },
  'Awaiting Packing': {
    tone: 'neutral',
    icon: PackageIcon
  },
  Packing: {
    tone: 'info',
    icon: PackageIcon
  },
  'Ready for Dispatch': {
    tone: 'info',
    icon: PackageCheckIcon
  },
  'Out for Delivery': {
    tone: 'warning',
    icon: TruckIcon
  },
  Delivered: {
    tone: 'success',
    icon: CircleCheckIcon
  },
  Active: {
    tone: 'success',
    icon: CircleDotIcon
  },
  Inactive: {
    tone: 'neutral',
    icon: CircleMinusIcon
  },
  Flagged: {
    tone: 'danger',
    icon: FlagIcon
  }
};
interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}
export function StatusBadge({
  status,
  label,
  className
}: StatusBadgeProps) {
  const config = statusMap[status] ?? {
    tone: 'neutral' as Tone,
    icon: CircleDotIcon
  };
  const Icon = config.icon;
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[11.5px] font-medium', toneClasses[config.tone], className)}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {label ?? status}
    </span>;
}