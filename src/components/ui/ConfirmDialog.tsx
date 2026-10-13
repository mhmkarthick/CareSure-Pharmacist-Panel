import React, { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon, BoxIcon } from "lucide-react";
import { Button, ButtonVariant } from "./Button";
import { IconButton } from "./IconButton";
import { cn } from "../../utils/cn";
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  loading?: boolean;
  confirmDisabled?: boolean;
  icon?: BoxIcon;
  tone?: 'danger' | 'primary' | 'neutral';
}
const toneClasses = {
  danger: 'bg-danger-soft text-danger-ink',
  primary: 'bg-primary-soft text-primary-ink',
  neutral: 'bg-canvas text-muted'
};
const FOCUSABLE = 'button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]';
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  loading = false,
  confirmDisabled = false,
  icon: Icon,
  tone = 'neutral'
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('select, textarea, input, [data-autofocus]');
      (target ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE))?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loadingRef.current) onCloseRef.current();
      if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open]);
  return <AnimatePresence>
      {open && <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div className="absolute inset-0 bg-navy/45" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.18
      }} onClick={() => !loading && onClose()} aria-hidden />
          <motion.div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descId : undefined} className="relative w-full max-w-md rounded-t-xl bg-white shadow-xl sm:rounded-xl" initial={{
        opacity: 0,
        scale: 0.96,
        y: 8
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.96,
        y: 8
      }} transition={{
        duration: 0.2,
        ease: [0.23, 1, 0.32, 1]
      }}>
            <div className="px-5 pt-5">
              <div className="flex items-start gap-3">
                {Icon && <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', toneClasses[tone])}>
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>}
                <div className="min-w-0 flex-1">
                  <h2 id={titleId} className="text-[15px] font-semibold text-ink">
                    {title}
                  </h2>
                  {description && <div id={descId} className="mt-1 text-[13px] text-muted">
                      {description}
                    </div>}
                </div>
                <IconButton size="sm" label="Close dialog" icon={XIcon} onClick={onClose} disabled={loading} />
              </div>
              {children && <div className="mt-4 space-y-3">{children}</div>}
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 rounded-b-xl border-t border-line bg-faint px-5 py-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant={confirmVariant} onClick={onConfirm} loading={loading} disabled={confirmDisabled}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>}
    </AnimatePresence>;
}