import type { Medicine, Order } from '../types/order';
import { getMedicine } from './lookups';

const allergyTerms: Record<string, string[]> = {
  penicillin: ['amoxicillin', 'ampicillin'],
  ibuprofen: ['ibuprofen'],
  'sulfa drugs': ['sulfamethoxazole']
};

export function allergyConflict(medicine: Medicine, allergies: string[]): string | undefined {
  const name = medicine.name.toLowerCase();
  return allergies.find((a) => {
    const key = a.toLowerCase();
    return (allergyTerms[key] ?? [key]).some((term) => name.includes(term));
  });
}

export function hasRxMedicines(order: Pick<Order, 'items'>): boolean {
  return order.items.some((i) => getMedicine(i.medicineId)?.rxOnly);
}

/** Orders containing prescription-only medicines need a doctor-generated prescription before approval. */
export function needsDoctorPrescription(order: Pick<Order, 'items' | 'doctorPrescription'>): boolean {
  return hasRxMedicines(order) && !order.doctorPrescription;
}

export type RxAvailability = 'both' | 'doctor' | 'uploaded' | 'none';

export function rxAvailability(order: Pick<Order, 'uploadedDocumentId' | 'doctorPrescription'>): RxAvailability {
  if (order.uploadedDocumentId && order.doctorPrescription) return 'both';
  if (order.doctorPrescription) return 'doctor';
  if (order.uploadedDocumentId) return 'uploaded';
  return 'none';
}