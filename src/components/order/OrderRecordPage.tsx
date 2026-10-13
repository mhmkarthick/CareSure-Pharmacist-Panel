import React from 'react';
import { useParams } from 'react-router-dom';
import type { OrderStatus } from '../../types/order';
import { useAppState } from '../../contexts/AppStateContext';
import { useDataStatus } from '../../hooks/useDataStatus';
import { DetailSkeleton } from '../ui/DetailSkeleton';
import { ErrorState } from '../ui/ErrorState';
import { RecordNotice } from './RecordNotice';
import { OrderRecordView } from './OrderRecordView';
import { orderPath } from '../../utils/workflow';

interface OrderRecordPageProps {
  expectedStatus: Extract<OrderStatus, 'Approved' | 'Rejected'>;
  listLabel: string;
  listPath: string;
}

/** Route wrapper for approved/rejected detail screens: loads the record and guards against status mismatches. */
export function OrderRecordPage({ expectedStatus, listLabel, listPath }: OrderRecordPageProps) {
  const { orderId } = useParams();
  const { orders } = useAppState();
  const { status, retry } = useDataStatus();
  const order = orders.find((o) => o.id === orderId);

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <div className="rounded-[10px] border border-line bg-white">
        <ErrorState message="This order couldn't be loaded." onRetry={retry} />
      </div>);

  }
  if (!order) {
    return <RecordNotice title="Order not found" message={`We couldn't find an order with ID ${orderId}.`} to={listPath} actionLabel={`Back to ${listLabel}`} />;
  }
  if (order.status !== expectedStatus) {
    return (
      <RecordNotice
        title={`This order isn't ${expectedStatus.toLowerCase()}`}
        message={`${order.id} is currently ${order.status}.`}
        to={orderPath(order)}
        actionLabel="Open current record" />);


  }
  return (
    <OrderRecordView
      order={order}
      breadcrumbs={[{ label: 'Orders', to: '/orders' }, { label: listLabel, to: listPath }, { label: order.id }]} />);


}