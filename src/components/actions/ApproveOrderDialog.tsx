import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Alert } from '../ui/Alert';
import { Field, inputClass } from '../ui/Field';
import type { Order } from '../../types/order';
import type { Patient } from '../../types/customer';
import { computeBill } from '../../utils/billing';
import { allergyConflict, needsDoctorPrescription } from '../../utils/clinical';
import { getMedicine } from '../../utils/lookups';
import { useFormatters } from '../../hooks/useFormatters';
import { cn } from '../../utils/cn';

interface ApproveOrderDialogProps {
  open: boolean;
  order: Order;
  patient?: Patient;
  onClose: () => void;
  onSubmit: (note?: string) => Promise<void>;
}

const checks = [
'Medicines and strengths match the prescription',
'Quantities are appropriate for the prescribed duration',
'Pricing and final payable amount have been reviewed'];


export function ApproveOrderDialog({ open, order, patient, onClose, onSubmit }: ApproveOrderDialogProps) {
  const fmt = useFormatters();
  const [checked, setChecked] = useState<boolean[]>(checks.map(() => false));
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (open) {
      setChecked(checks.map(() => false));
      setNote('');
      setShowError(false);
    }
  }, [open]);

  const blocked = needsDoctorPrescription(order);
  const conflicts = order.items.
  map((i) => {
    const med = getMedicine(i.medicineId);
    const allergy = med ? allergyConflict(med, patient?.allergies ?? []) : undefined;
    return med && allergy ? `${med.name} (${allergy})` : null;
  }).
  filter((v): v is string => Boolean(v));
  const allChecked = checked.every(Boolean);

  const submit = async () => {
    if (!allChecked) {
      setShowError(true);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(note.trim() || undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title="Verify & approve order"
      description={
      <>
          <span className="font-medium text-ink">{order.id}</span> for {patient?.name ?? 'patient'} ·{' '}
          <span className="font-medium tabular-nums text-ink">{fmt.money(computeBill(order).total)}</span>
        </>
      }
      icon={ShieldCheckIcon}
      tone="primary"
      confirmLabel="Approve Order"
      onConfirm={submit}
      loading={submitting}
      confirmDisabled={blocked}>
      
      {blocked ?
      <Alert tone="danger" title="Doctor-generated prescription required">
          This order contains prescription-only medicines but has no doctor-generated prescription. Use Move to Doctor so the order completes medical review first.
        </Alert> :

      <>
          {conflicts.length > 0 &&
        <Alert tone="warning" title="Allergy flag">
              {conflicts.join(', ')} matches the patient's recorded allergies. Confirm this was clinically reviewed before approving.
            </Alert>
        }
          <fieldset>
            <legend className="mb-1.5 text-[12px] font-medium text-ink">Verification checklist</legend>
            <div className="space-y-1.5">
              {checks.map((label, i) =>
            <label key={label} className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-[13px] text-ink hover:bg-faint">
                  <input
                type="checkbox"
                checked={checked[i]}
                onChange={(e) => {
                  setChecked((prev) => prev.map((v, idx) => idx === i ? e.target.checked : v));
                  setShowError(false);
                }}
                className="mt-0.5 h-4 w-4 rounded border-line-strong accent-[#0E7C7E]" />
              
                  {label}
                </label>
            )}
            </div>
            {showError && !allChecked &&
          <p className="mt-1.5 text-[12px] text-danger-ink" role="alert">
                Confirm every check before approving.
              </p>
          }
          </fieldset>
          <Field label="Approval note" htmlFor="approve-note" hint="Optional. Saved to the order history.">
            <textarea
            id="approve-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={cn(inputClass, 'resize-y py-2')} />
          
          </Field>
        </>
      }
    </ConfirmDialog>);

}