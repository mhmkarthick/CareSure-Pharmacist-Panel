import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAppState } from '../../contexts/AppStateContext';
import { useDataStatus } from '../../hooks/useDataStatus';
import { DetailSkeleton } from '../../components/ui/DetailSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { RecordNotice } from '../../components/order/RecordNotice';
import { OrderRecordView } from '../../components/order/OrderRecordView';

/** Generic order route. Redirects to the status-specific screen, or shows a read-only record while an order is with a doctor or caller. */
export function OrderDetails() {
  const { orderId } = useParams();
  const { orders } = useAppState();
  const { status, retry } = useDataStatus();
  const order = orders.find((o) => o.id === orderId);

  if (order?.status === 'Pending Approval') return <Navigate replace to={`/orders/pending-approval/${order.id}`} />;
  if (order?.status === 'Approved') return <Navigate replace to={`/orders/approved/${order.id}`} />;
  if (order?.status === 'Rejected') return <Navigate replace to={`/orders/rejected/${order.id}`} />;

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <div className="rounded-[10px] border border-line bg-white">
        <ErrorState message="This order couldn't be loaded." onRetry={retry} />
      </div>);

  }
  if (!order) {
    return <RecordNotice title="Order not found" message={`We couldn't find an order with ID ${orderId}.`} to="/orders" actionLabel="Back to All Orders" />;
  }
  return <OrderRecordView order={order} breadcrumbs={[{ label: 'Orders', to: '/orders' }, { label: 'All Orders', to: '/orders' }, { label: order.id }]} />;
}