import React from 'react';
import { OrderRecordPage } from '../../components/order/OrderRecordPage';

export function RejectedOrderDetails() {
  return <OrderRecordPage expectedStatus="Rejected" listLabel="Rejected Orders" listPath="/orders/rejected" />;
}