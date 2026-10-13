export type CustomerStatus = 'Active' | 'Inactive' | 'Flagged';

export interface CustomerNote {
  id: string;
  at: string;
  author: string;
  text: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  registeredAt: string;
  status: CustomerStatus;
  city: string;
  preferredLanguage: string;
  notes: CustomerNote[];
}

export interface Patient {
  id: string;
  customerId: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  relation: string;
  weightKg?: number;
  allergies: string[];
  conditions: string[];
}