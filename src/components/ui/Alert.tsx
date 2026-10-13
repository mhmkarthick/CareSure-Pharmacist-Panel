import React from "react";
import { InfoIcon, TriangleAlertIcon, CircleXIcon, CircleCheckIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
type AlertTone = 'info' | 'warning' | 'danger' | 'success';
const tones: Record<AlertTone, {
  classes: string;
  icon: BoxIcon;
}> = {
  info: {
    classes: 'bg-info-soft border-info/25 text-info-ink',
    icon: InfoIcon
  },
  warning: {
    classes: 'bg-warning-soft border-warning/30 text-warning-ink',
    icon: TriangleAlertIcon
  },
  danger: {
    classes: 'bg-danger-soft border-danger/25 text-danger-ink',
    icon: CircleXIcon
  },
  success: {
    classes: 'bg-success-soft border-success/25 text-success-ink',
    icon: CircleCheckIcon
  }
};
interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  icon?: BoxIcon;
  className?: string;
}
export function Alert({
  tone = 'info',
  title,
  children,
  action,
  icon,
  className
}: AlertProps) {
  const config = tones[tone];
  const Icon = icon ?? config.icon;
  return <div className={cn('flex items-start gap-2.5 rounded-lg border px-3 py-2.5', config.classes, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 text-[12.5px]">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5', 'text-ink/90')}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>;
}