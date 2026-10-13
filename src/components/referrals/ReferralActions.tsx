import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CircleCheckIcon, ExternalLinkIcon, StickyNoteIcon, Undo2Icon, EyeIcon } from 'lucide-react';
import type { Referral } from '../../types/referral';
import type { Order } from '../../types/order';
import { useAppState } from '../../contexts/AppStateContext';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Field, inputClass } from '../ui/Field';
import { needsDoctorPrescription } from '../../utils/clinical';
import { errorMessage } from '../../utils/format';
import { cn } from '../../utils/cn';

interface ReferralActionsProps {
  referral: Referral;
  order?: Order;
  onAddNote: () => void;
}

type DialogKind = 'return' | 'complete' | null;

export function ReferralActions({ referral, order, onAddNote }: ReferralActionsProps) {
  const { markReferralReviewed, returnDoctorReferral, completeCallerClarification, returnCallerReferral } = useAppState();
  const navigate = useNavigate();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [busy, setBusy] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolutionError, setResolutionError] = useState('');

  const isDoctor = referral.kind === 'doctor';
  const canReview = isDoctor && referral.status === 'Responded' && !referral.reviewedAt;
  const canReturnDoctor = isDoctor && referral.status === 'Responded' && Boolean(referral.reviewedAt);
  const canComplete = !isDoctor && (referral.status === 'Pending' || referral.status === 'In Progress');
  const canReturnCaller = !isDoctor && referral.status === 'Clarification Completed';
  const goesToDoctor = order ? needsDoctorPrescription(order) : false;

  const perform = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Button icon={StickyNoteIcon} onClick={onAddNote}>
        Add note
      </Button>
      <ButtonLink to={`/orders/${referral.orderId}`} icon={ExternalLinkIcon}>
        View related order
      </ButtonLink>
      {isDoctor && (referral.status === 'Responded' || canReview) &&
      <Button
        icon={EyeIcon}
        disabled={!canReview || busy}
        loading={busy && canReview}
        onClick={() => perform(async () => {
          await markReferralReviewed(referral.id);
          toast.success('Doctor response marked as reviewed');
        })}>
        
          {referral.reviewedAt ? 'Reviewed' : 'Mark as reviewed'}
        </Button>
      }
      {isDoctor && referral.status !== 'Returned for Pharmacist Review' &&
      <Button
        variant="primary"
        icon={Undo2Icon}
        disabled={!canReturnDoctor || busy}
        onClick={() => setDialog('return')}
        title={!canReturnDoctor ? 'Available after the doctor responds and you mark the response as reviewed' : undefined}>
        
          Return to Pharmacist Review
        </Button>
      }
      {canComplete &&
      <Button
        variant="primary"
        icon={CircleCheckIcon}
        onClick={() => {
          setResolution('');
          setResolutionError('');
          setDialog('complete');
        }}>
        
          Mark clarification completed
        </Button>
      }
      {canReturnCaller &&
      <Button variant="primary" icon={Undo2Icon} onClick={() => setDialog('return')} disabled={busy}>
          Return to workflow
        </Button>
      }

      <ConfirmDialog
        open={dialog === 'return'}
        onClose={() => !busy && setDialog(null)}
        title={isDoctor ? 'Return order for pharmacist review?' : 'Return order to workflow?'}
        icon={Undo2Icon}
        tone="primary"
        description={
        isDoctor ?
        `${referral.orderId} will move back to Pending Approval with the doctor's response attached. You still need to verify and approve it.` :
        goesToDoctor ?
        `${referral.orderId} contains prescription medicines without a doctor-generated prescription, so it will go to the Doctor queue next — not straight to approval.` :
        `${referral.orderId} will move back to Pending Approval for pharmacist verification.`
        }
        confirmLabel={isDoctor || !goesToDoctor ? 'Return to Pending Approval' : 'Send to Doctor queue'}
        loading={busy}
        onConfirm={() =>
        perform(async () => {
          if (isDoctor) {
            await returnDoctorReferral(referral.id);
            setDialog(null);
            toast.success(`${referral.orderId} returned to Pending Approval`);
            navigate(`/orders/pending-approval/${referral.orderId}`);
          } else {
            const result = await returnCallerReferral(referral.id);
            setDialog(null);
            if (result.destination === 'doctor' && result.doctorReferralId) {
              toast.success(`Doctor referral ${result.doctorReferralId} created`, { description: 'Doctor review is required before approval.' });
              navigate(`/referrals/doctor/${result.doctorReferralId}`);
            } else {
              toast.success(`${referral.orderId} returned to Pending Approval`);
              navigate(`/orders/pending-approval/${referral.orderId}`);
            }
          }
        })
        } />
      

      <ConfirmDialog
        open={dialog === 'complete'}
        onClose={() => !busy && setDialog(null)}
        title="Mark clarification as completed"
        description="Record what was confirmed with the customer. The order stays with the caller desk until you return it to the workflow."
        icon={CircleCheckIcon}
        tone="primary"
        confirmLabel="Mark completed"
        loading={busy}
        onConfirm={() => {
          if (resolution.trim().length < 10) {
            setResolutionError('Summarise the outcome in at least 10 characters.');
            return;
          }
          perform(async () => {
            await completeCallerClarification(referral.id, resolution.trim());
            setDialog(null);
            toast.success('Clarification marked as completed');
          });
        }}>
        
        <Field label="Resolution summary" htmlFor="caller-resolution" required error={resolutionError}>
          <textarea
            id="caller-resolution"
            rows={3}
            value={resolution}
            onChange={(e) => {
              setResolution(e.target.value);
              setResolutionError('');
            }}
            aria-invalid={Boolean(resolutionError)}
            placeholder="e.g. Customer confirmed the medicines are for their father, patient record updated."
            className={cn(inputClass, 'resize-y py-2')} />
          
        </Field>
      </ConfirmDialog>
    </>);

}