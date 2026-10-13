import React from "react";
import { LoaderCircleIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'dangerSolid' | 'ghost';
export type ButtonSize = 'sm' | 'md';
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover',
  secondary: 'bg-white text-ink border border-line hover:bg-faint hover:border-line-strong',
  danger: 'bg-white text-danger-ink border border-danger/40 hover:bg-danger-soft hover:border-danger/60',
  dangerSolid: 'bg-danger text-white border border-danger hover:bg-danger-hover hover:border-danger-hover',
  ghost: 'bg-transparent text-muted border border-transparent hover:bg-canvas hover:text-ink'
};
const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-[12px] gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-2'
};
export function buttonClasses(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', className?: string): string {
  return cn('inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap select-none', 'transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.98]', 'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', variants[variant], sizes[size], className);
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: BoxIcon;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon: Icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}, ref) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden /> : Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {children}
    </button>;
});