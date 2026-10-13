import React from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-8 w-8 text-[12px]', md: 'h-10 w-10 text-[14px]', lg: 'h-16 w-16 text-[20px]' };

export function Avatar({ name, size = 'sm', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary-ink',
        sizes[size],
        className
      )}
      aria-hidden>
      
      {initials(name)}
    </span>);

}