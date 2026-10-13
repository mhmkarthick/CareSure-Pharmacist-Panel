import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import type { ReferralKind } from '../../types/referral';
import { useAppState } from '../../contexts/AppStateContext';
import { useDataStatus } from '../../hooks/useDataStatus';
import { useFormatters } from '../../hooks/useFormatters';
import { PageHeader } from '../ui/PageHeader';
import { StatusBadge } from '../ui/StatusBadge';
import { Alert } from '../ui/Alert';
import { Panel } from '../ui/Panel';
import { DetailSkeleton } from '../ui/DetailSkeleton';
import { ErrorState } from '../ui/ErrorState';
import { RecordNotice } from '../order/RecordNotice';
import { CustomerDetailsCard } from '../order/CustomerDetailsCard';
import { PatientDetailsCard } from '../order/PatientDetailsCard';
import { OrderWorkspace } from '../order/OrderWorkspace';
import { ActivityTimeline } from '../order/ActivityTimeline';
import { NotesPanel } from '../order/NotesPanel';
import { ReferralSummaryCard } from './ReferralSummaryCard';
import { ReferralActions } from './ReferralActions';
import { getCustomer, getPatient } from '../../utils/lookups';

const statusGuidance: Record<string, {tone: 'info' | 'warning' | 'success';title: string;body: string;}> = {
  'Pending Review': { tone: 'warning', title: 'Waiting for a doctor', body: 'No doctor has picked up this referral yet. The order cannot be approved until the doctor responds.' },
  'In Review': { tone: 'info', title: 'Doctor is reviewing', body: 'A doctor is reviewing this referral. Actions unlock once a response is recorded.' },
  Responded: { tone: 'success', title: 'Doctor has responded', body: 'Read the response in the notes, mark it as reviewed, then return the order to the approval queue.' },
  'Returned for Pharmacist Review': { tone: 'info', title: 'Returned to the approval queue', body: 'This referral is closed. The order continues in pharmacist review.' },
  Pending: { tone: 'warning', title: 'Waiting for the caller desk', body: 'No caller has contacted the customer yet.' },
  'In Progress': { tone: 'info', title: 'Caller is contacting the customer', body: 'Mark the clarification completed once the outcome is confirmed.' },
  'Clarification Completed': { tone: 'success', title: 'Clarification completed', body: 'Return the order to the workflow. Orders with unreviewed prescription medicines go to the doctor first.' },
  'Returned to Workflow': { tone: 'info', title: 'Returned to workflow', body: 'This referral is closed. The order has moved to its next required stage.' }
};

export function ReferralDetailView({ kind }: {kind: ReferralKind;}) {
  const { referralId } = useParams();
  const { referrals, orders, addReferralNote } = useAppState();
  const fmt = useFormatters();
  const { status, retry } = useDataStatus();
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const listLabel = kind === 'doctor' ? 'Doctor Referrals' : 'Caller Referrals';
  const listPath = `/referrals/${kind}`;
  const referral = referrals.find((r) => r.id === referralId && r.kind === kind);

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <div className="rounded-[10px] border border-line bg-white">
        <ErrorState message="This referral couldn't be loaded." onRetry={retry} />
      </div>);

  }
  if (!referral) {
    return <RecordNotice title="Referral not found" message={`We couldn't find referral ${referralId}.`} to={listPath} actionLabel={`Back to ${listLabel}`} />;
  }

  const order = orders.find((o) => o.id === referral.orderId);
  const customer = order ? getCustomer(order.customerId) : undefined;
  const patient = order ? getPatient(order.patientId) : undefined;
  const guidance = statusGuidance[referral.status];

  const focusNote = () => {
    noteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => noteRef.current?.focus(), 250);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        breadcrumbs={[{ label: 'Referrals' }, { label: listLabel, to: listPath }, { label: referral.id }]}
        title={kind === 'doctor' ? 'Doctor Referral' : 'Caller Referral'}
        meta={
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
            <span className="text-[13px] font-semibold tabular-nums text-ink">{referral.id}</span>
            <span aria-hidden>·</span>
            <span>Created {fmt.dateTime(referral.createdAt)}</span>
            <StatusBadge status={referral.status} />
            {referral.reviewedAt && <span className="text-success-ink">Response reviewed {fmt.dateTime(referral.reviewedAt)}</span>}
          </div>
        }
        actions={<ReferralActions referral={referral} order={order} onAddNote={focusNote} />} />
      

      {guidance &&
      <Alert tone={guidance.tone} title={guidance.title}>
          {guidance.body}
        </Alert>
      }

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <ReferralSummaryCard referral={referral} order={order} />
        <div className="grid gap-3">
          <CustomerDetailsCard customer={customer} title="Customer" />
          <PatientDetailsCard patient={patient} />
        </div>
      </div>

      {order && <OrderWorkspace order={order} patient={patient} />}

      <div className="grid gap-3 lg:grid-cols-2">
        <NotesPanel
          title={kind === 'doctor' ? 'Notes & Doctor Responses' : 'Notes History'}
          notes={referral.notes}
          onAdd={(text) => addReferralNote(referral.id, text)}
          inputRef={noteRef} />
        
        <Panel title="Referral Activity" description="Timeline of this referral">
          <div className="p-4">
            <ActivityTimeline events={referral.activity} />
          </div>
        </Panel>
      </div>
    </div>);

}