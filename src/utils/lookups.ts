import { customers } from '../data/customers';
import { patients } from '../data/patients';
import { doctors } from '../data/doctors';
import { medicines } from '../data/medicines';
import { prescriptionDocuments } from '../data/prescriptionDocuments';
import type { Customer, Patient } from '../types/customer';
import type { Doctor, Medicine, PrescriptionDocument } from '../types/order';

const customerMap = new Map(customers.map((c) => [c.id, c]));
const patientMap = new Map(patients.map((p) => [p.id, p]));
const doctorMap = new Map(doctors.map((d) => [d.id, d]));
const medicineMap = new Map(medicines.map((m) => [m.id, m]));
const documentMap = new Map(prescriptionDocuments.map((d) => [d.id, d]));

export const getCustomer = (id: string): Customer | undefined => customerMap.get(id);
export const getPatient = (id: string): Patient | undefined => patientMap.get(id);
export const getDoctor = (id: string): Doctor | undefined => doctorMap.get(id);
export const getMedicine = (id: string): Medicine | undefined => medicineMap.get(id);
export const getDocument = (id: string): PrescriptionDocument | undefined => documentMap.get(id);
export const patientsForCustomer = (customerId: string): Patient[] =>
patients.filter((p) => p.customerId === customerId);