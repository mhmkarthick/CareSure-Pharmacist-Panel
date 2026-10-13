import React, { useEffect, useState } from 'react';
import { StethoscopeIcon, PhoneCallIcon } from 'lucide-react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Field, inputClass } from '../ui/Field';
import { callerReferralReasons, doctorReferralReasons } from '../../data/workflowReasons';
import type { Order } from '../../types/order';
import type { ReferralKind } from '../../types/referral';
import { cn } from '../../utils/cn';

interface ReferralDialogProps {
  kind: ReferralKind;
  open: boolean;
  order: Order;
  onClose: () => void;
  onSubmit: (reason: string, notes: string) => Promise<void>;
}

const copy = {
  doctor: {
    title: 'Move order to doctor',
    description: 'The order leaves the approval queue and a doctor referral is created for medical clarification.',
    confirm: 'Move to Doctor',
    reasonLabel: 'Referral reason',
    notesLabel: 'Notes for the doctor',
    placeholder: 'Describe what the doctor needs to clarify…',
    reasons: doctorReferralReasons
  },
  caller: {
    title: 'Request caller clarification',
    description: 'The order leaves the approval queue and the caller desk contacts the customer. Doctor review and pharmacist approval still apply afterwards.',
    confirm: 'Send to Caller',
    reasonLabel: 'Clarification reason',
    notesLabel: 'Notes for the caller',
    placeholder: 'What should the caller confirm with the customer?',
    reasons: callerReferralReasons
  }
};

export function ReferralDialog({ kind, open, order, onClose, onSubmit }: ReferralDialogProps) {
  const c = copy[kind];
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{reason?: string;notes?: string;}>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setNotes('');
      setErrors({});
    }
  }, [open]);

  const submit = async () => {
    const next: typeof errors = {};
    if (!reason) next.reason = 'Select a reason.';
    if (notes.trim().length < 10) next.notes = 'Add at least 10 characters so the next reviewer has context.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      await onSubmit(reason, notes.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={c.title}
      description={
      <>
          <span className="font-medium text-ink">{order.id}</span> — {c.description}
        </>
      }
      icon={kind === 'doctor' ? StethoscopeIcon : PhoneCallIcon}
      tone="primary"
      confirmLabel={c.confirm}
      onConfirm={submit}
      loading={submitting}>
      
      <Field label={c.reasonLabel} htmlFor={`${kind}-reason`} required error={errors.reason}>
        <select
          id={`${kind}-reason`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={Boolean(errors.reason)}
          className={cn(inputClass, 'h-9')}>
          
          <option value="">Select a reason</option>
          {c.reasons.map((r) =>
          <option key={r} value={r}>
              {r}
            </option>
          )}
        </select>
      </Field>
      <Field label={c.notesLabel} htmlFor={`${kind}-notes`} required error={errors.notes}>
        <textarea
          id={`${kind}-notes`}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-invalid={Boolean(errors.notes)}
          placeholder={c.placeholder}
          className={cn(inputClass, 'resize-y py-2')} />
        
      </Field>
    </ConfirmDialog>);

}