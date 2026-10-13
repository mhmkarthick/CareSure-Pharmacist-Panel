import React from 'react';
import { CircleAlertIcon } from 'lucide-react';

export const inputClass =
'w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-canvas disabled:text-muted aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15';

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-[12px] font-medium text-ink">
        {label}
        {required &&
        <span className="text-danger-ink" aria-hidden>
            {' '}
            *
          </span>
        }
      </label>
      {children}
      {error ?
      <p id={`${htmlFor}-error`} className="mt-1 flex items-center gap-1 text-[12px] text-danger-ink" role="alert">
          <CircleAlertIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p> :

      hint &&
      <p id={`${htmlFor}-hint`} className="mt-1 text-[12px] text-muted">
            {hint}
          </p>

      }
    </div>);

}