import React from 'react';
import type { Order } from '../../types/order';
import type { Patient } from '../../types/customer';
import { PrescriptionViewer } from './PrescriptionViewer';
import { GeneratedPrescription } from './GeneratedPrescription';
import { MedicinesCartPanel } from './MedicinesCartPanel';
import { getDocument } from '../../utils/lookups';

interface OrderWorkspaceProps {
  order: Order;
  patient?: Patient;
}

const PANEL_HEIGHT = 'h-[540px] xl:h-[max(520px,calc(100vh-345px))]';

/** Three equal panels: customer upload, doctor prescription, medicines cart. Stacks on smaller screens. */
export function OrderWorkspace({ order, patient }: OrderWorkspaceProps) {
  const doc = order.uploadedDocumentId ? getDocument(order.uploadedDocumentId) : undefined;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <PrescriptionViewer document={doc} orderType={order.type} className={PANEL_HEIGHT} />
      <GeneratedPrescription order={order} patient={patient} className={PANEL_HEIGHT} />
      <MedicinesCartPanel
        order={order}
        allergies={patient?.allergies ?? []}
        className="md:col-span-2 md:h-[440px] xl:col-span-1 xl:h-[max(520px,calc(100vh-345px))]" />
      
    </div>);

}