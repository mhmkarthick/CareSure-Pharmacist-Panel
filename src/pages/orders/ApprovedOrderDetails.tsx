import React from 'react';
import { OrderRecordPage } from '../../components/order/OrderRecordPage';

export function ApprovedOrderDetails() {
  return <OrderRecordPage expectedStatus="Approved" listLabel="Approved Orders" listPath="/orders/approved" />;
}