export interface PharmacistProfile {
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  role: string;
  status: 'Active' | 'Suspended';
  branch: string;
  shift: string;
  registrationNumber: string;
  accountCreated: string;
  lastSignIn: string;
}