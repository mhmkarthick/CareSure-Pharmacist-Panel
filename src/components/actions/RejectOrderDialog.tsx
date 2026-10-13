import React, { useEffect, useState } from 'react';
import { CircleXIcon } from 'lucide-react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Field, inputClass } from '../ui/Field';
import { rejectionReasons } from '../../data/workflowReasons';
import type { Order } from '../../types/order';
import { cn } from '../../utils/cn';

interface RejectOrderDialogProps {
  open: boolean;
  order: Order;
  onClose: () => void;
  onSubmit: (reason: string, details?: string) => Promise<void>;
}

export function RejectOrderDialog({ open, order, onClose, onSubmit }: RejectOrderDialogProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState<{reason?: string;details?: string;}>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setDetails('');
      setErrors({});
    }
  }, [open]);

  const submit = async () => {
    const next: typeof errors = {};
    if (!reason) next.reason = 'Select a rejection reason.';
    if (reason === 'Other' && details.trim().length < 10) next.details = 'Describe the reason in at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await onSubmit(reason, details.trim() || undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Reject this order?"
      description={`${order.id} will leave the approval queue and move to Rejected Orders.`}
      icon={CircleXIcon}
      tone="danger"
      confirmLabel="Reject Order"
      confirmVariant="dangerSolid"
      onConfirm={submit}
      loading={submitting}>
      
      <Field label="Rejection reason" htmlFor="reject-reason" required error={errors.reason}>
        <select
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={Boolean(errors.reason)}
          className={cn(inputClass, 'h-9')}>
          
          <option value="">Select a reason</option>
          {rejectionReasons.map((r) =>
          <option key={r} value={r}>
              {r}
            </option>
          )}
        </select>
      </Field>
      <Field
        label="Details"
        htmlFor="reject-details"
        required={reason === 'Other'}
        error={errors.details}
        hint="Recorded on the order and shown in Rejected Orders.">
        
        <textarea
          id="reject-details"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          aria-invalid={Boolean(errors.details)}
          placeholder="Add context for the customer support team…"
          className={cn(inputClass, 'resize-y py-2')} />
        
      </Field>
    </ConfirmDialog>);

}