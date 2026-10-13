import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CircleXIcon, PhoneCallIcon, ShieldCheckIcon, StethoscopeIcon, TriangleAlertIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { useDataStatus } from '../../hooks/useDataStatus';
import { OrderDetailHeader } from '../../components/order/OrderDetailHeader';
import { CustomerDetailsCard } from '../../components/order/CustomerDetailsCard';
import { PatientDetailsCard } from '../../components/order/PatientDetailsCard';
import { OrderWorkspace } from '../../components/order/OrderWorkspace';
import { RecordNotice } from '../../components/order/RecordNotice';
import { RejectOrderDialog } from '../../components/actions/RejectOrderDialog';
import { ReferralDialog } from '../../components/actions/ReferralDialog';
import { ApproveOrderDialog } from '../../components/actions/ApproveOrderDialog';
import { Button } from '../../components/ui/Button';
import { DetailSkeleton } from '../../components/ui/DetailSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { getCustomer, getPatient } from '../../utils/lookups';
import { needsDoctorPrescription } from '../../utils/clinical';
import { orderPath } from '../../utils/workflow';
import { errorMessage } from '../../utils/format';

type DialogKind = 'reject' | 'doctor' | 'caller' | 'approve' | null;

export function PendingOrderDetails() {
  const { orderId } = useParams();
  const { orders, approveOrder, rejectOrder, referToDoctor, referToCaller } = useAppState();
  const navigate = useNavigate();
  const { status, retry } = useDataStatus();
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [busy, setBusy] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <div className="rounded-[10px] border border-line bg-white">
        <ErrorState message="This order couldn't be loaded." onRetry={retry} />
      </div>);

  }
  if (!order) {
    return (
      <RecordNotice
        title="Order not found"
        message={`We couldn't find an order with ID ${orderId}.`}
        to="/orders/pending-approval"
        actionLabel="Back to Pending Approval" />);


  }
  if (order.status !== 'Pending Approval') {
    return (
      <RecordNotice
        title="This order is no longer pending approval"
        message={`${order.id} is now ${order.status}. Open the current record to see its details.`}
        to={orderPath(order)}
        actionLabel="Open current record" />);


  }

  const customer = getCustomer(order.customerId);
  const patient = getPatient(order.patientId);
  const blocked = needsDoctorPrescription(order);

  const perform = async (action: () => Promise<unknown>, onSuccess: () => void) => {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      setDialog(null);
      onSuccess();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const goToQueue = () => navigate('/orders/pending-approval');

  return (
    <div className="space-y-3">
      <OrderDetailHeader
        order={order}
        breadcrumbs={[
        { label: 'Orders', to: '/orders' },
        { label: 'Pending Approval', to: '/orders/pending-approval' },
        { label: order.id }]
        } />
      

      <div className="grid gap-3 md:grid-cols-2">
        <CustomerDetailsCard
          customer={customer}
          order={order}
          action={
          <Button size="sm" variant="ghost" icon={PhoneCallIcon} onClick={() => setDialog('caller')} className="h-7 px-2 text-[12px]">
              Request clarification
            </Button>
          } />
        
        <PatientDetailsCard patient={patient} />
      </div>

      <OrderWorkspace order={order} patient={patient} />

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
            {blocked ?
            <>
                <TriangleAlertIcon className="h-4 w-4 shrink-0 text-danger-ink" aria-hidden />
                <span className="text-danger-ink">Prescription medicines need a doctor-generated prescription. Move to Doctor before approving.</span>
              </> :

            'Compare both prescriptions with the cart before approving.'
            }
          </p>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Button variant="danger" icon={CircleXIcon} onClick={() => setDialog('reject')} disabled={busy}>
              Reject Order
            </Button>
            <Button variant="secondary" icon={StethoscopeIcon} onClick={() => setDialog('doctor')} disabled={busy}>
              Move to Doctor
            </Button>
            <Button variant="primary" icon={ShieldCheckIcon} onClick={() => setDialog('approve')} disabled={busy}>
              Verify &amp; Approve
            </Button>
          </div>
        </div>
      </div>

      <RejectOrderDialog
        open={dialog === 'reject'}
        order={order}
        onClose={() => !busy && setDialog(null)}
        onSubmit={(reason, details) =>
        perform(
          () => rejectOrder(order.id, reason, details),
          () => {
            toast.success(`${order.id} rejected`, {
              description: 'Moved to Rejected Orders.',
              action: { label: 'View', onClick: () => navigate(`/orders/rejected/${order.id}`) }
            });
            goToQueue();
          }
        )
        } />
      
      <ReferralDialog
        kind="doctor"
        open={dialog === 'doctor'}
        order={order}
        onClose={() => !busy && setDialog(null)}
        onSubmit={(reason, notes) =>
        perform(
          async () => {
            const id = await referToDoctor(order.id, reason, notes);
            toast.success(`Referred to doctor as ${id}`, {
              description: `Linked to ${order.id}.`,
              action: { label: 'View referral', onClick: () => navigate(`/referrals/doctor/${id}`) }
            });
          },
          goToQueue
        )
        } />
      
      <ReferralDialog
        kind="caller"
        open={dialog === 'caller'}
        order={order}
        onClose={() => !busy && setDialog(null)}
        onSubmit={(reason, notes) =>
        perform(
          async () => {
            const id = await referToCaller(order.id, reason, notes);
            toast.success(`Sent to caller desk as ${id}`, {
              description: `Linked to ${order.id}.`,
              action: { label: 'View referral', onClick: () => navigate(`/referrals/caller/${id}`) }
            });
          },
          goToQueue
        )
        } />
      
      <ApproveOrderDialog
        open={dialog === 'approve'}
        order={order}
        patient={patient}
        onClose={() => !busy && setDialog(null)}
        onSubmit={(note) =>
        perform(
          () => approveOrder(order.id, note),
          () => {
            toast.success(`${order.id} approved`, {
              description: 'Moved to Approved Orders for fulfilment.',
              action: { label: 'View', onClick: () => navigate(`/orders/approved/${order.id}`) }
            });
            goToQueue();
          }
        )
        } />
      
    </div>);

}