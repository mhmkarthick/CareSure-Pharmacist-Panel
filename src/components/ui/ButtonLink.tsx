import React from "react";
import { Link } from "react-router-dom";
import { buttonClasses, ButtonSize, ButtonVariant } from "./Button";
import { BoxIcon } from "lucide-react";
interface ButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: BoxIcon;
  className?: string;
  children: React.ReactNode;
}
export function ButtonLink({
  to,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  className,
  children
}: ButtonLinkProps) {
  return <Link to={to} className={buttonClasses(variant, size, className)}>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      {children}
    </Link>;
}