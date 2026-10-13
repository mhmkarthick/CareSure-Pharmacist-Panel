export type OrderType = 'OTC' | 'Upload Prescription' | 'Add Rx';

export type OrderStatus =
'Pending Approval' |
'Approved' |
'Rejected' |
'Doctor Review' |
'Caller Clarification';

export type FulfilmentStatus =
'Awaiting Packing' |
'Packing' |
'Ready for Dispatch' |
'Out for Delivery' |
'Delivered';

export type ActorRole = 'Customer' | 'System' | 'Caller' | 'Doctor' | 'Pharmacist';

export interface Medicine {
  id: string;
  name: string;
  strength: string;
  form: string;
  pack: string;
  price: number;
  rxOnly: boolean;
}

export interface OrderItem {
  medicineId: string;
  qty: number;
  dosage?: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  registration: string;
  specialty: string;
}

export interface DoctorPrescription {
  rxNumber: string;
  doctorId: string;
  issuedAt: string;
  diagnosis: string;
  advice?: string;
}

export interface PrescriptionDocument {
  id: string;
  fileName: string;
  uploadedAt: string;
  pages: string[];
  ocrStatus: 'Extracted' | 'Partially extracted' | 'Not processed';
}

export interface HistoryEvent {
  id: string;
  at: string;
  actor: string;
  role: ActorRole;
  action: string;
  note?: string;
}

export interface ApprovalInfo {
  by: string;
  at: string;
  note?: string;
}

export interface RejectionInfo {
  by: string;
  at: string;
  reason: string;
  details?: string;
}

export interface Order {
  id: string;
  customerId: string;
  patientId: string;
  type: OrderType;
  status: OrderStatus;
  placedAt: string;
  updatedAt: string;
  items: OrderItem[];
  discount: number;
  deliveryFee: number;
  uploadedDocumentId?: string;
  doctorPrescription?: DoctorPrescription;
  approval?: ApprovalInfo;
  rejection?: RejectionInfo;
  fulfilment?: FulfilmentStatus;
  history: HistoryEvent[];
}

export type SeedOrder = Omit<Order, 'history'>;

export interface BillBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}