import React from "react";
import { cn } from "../../utils/cn";
import { BoxIcon } from "lucide-react";
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: BoxIcon;
  size?: 'sm' | 'md';
}
export function IconButton({
  label,
  icon: Icon,
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return <button type={type} aria-label={label} title={label} className={cn('inline-flex shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 ease-out', 'hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-40', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary', size === 'sm' ? 'h-7 w-7' : 'h-9 w-9', className)} {...rest}>
      <Icon className="h-4 w-4" aria-hidden />
    </button>;
}