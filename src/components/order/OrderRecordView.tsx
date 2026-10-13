import React from 'react';
import type { Order } from '../../types/order';
import { useAppState } from '../../contexts/AppStateContext';
import { getCustomer, getPatient } from '../../utils/lookups';
import { activeReferralFor } from '../../utils/workflow';
import { OrderDetailHeader } from './OrderDetailHeader';
import { DecisionSummary } from './DecisionSummary';
import { CustomerDetailsCard } from './CustomerDetailsCard';
import { PatientDetailsCard } from './PatientDetailsCard';
import { OrderWorkspace } from './OrderWorkspace';
import { OrderSummaryCard } from './OrderSummaryCard';
import { ActivityTimeline } from './ActivityTimeline';
import { Panel } from '../ui/Panel';
import type { BreadcrumbItem } from '../ui/Breadcrumbs';

interface OrderRecordViewProps {
  order: Order;
  breadcrumbs: BreadcrumbItem[];
}

/** Read-only order record used for approved, rejected and in-referral orders. */
export function OrderRecordView({ order, breadcrumbs }: OrderRecordViewProps) {
  const { referrals } = useAppState();
  const customer = getCustomer(order.customerId);
  const patient = getPatient(order.patientId);
  const activeReferral = activeReferralFor(order, referrals);

  return (
    <div className="space-y-3">
      <OrderDetailHeader order={order} breadcrumbs={breadcrumbs} />
      <DecisionSummary order={order} activeReferral={activeReferral} />
      <div className="grid gap-3 md:grid-cols-2">
        <CustomerDetailsCard customer={customer} order={order} />
        <PatientDetailsCard patient={patient} />
      </div>
      <OrderWorkspace order={order} patient={patient} />
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Order History" description="Every workflow step recorded for this order">
          <div className="p-4">
            <ActivityTimeline events={order.history} />
          </div>
        </Panel>
        <div>
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>);

}