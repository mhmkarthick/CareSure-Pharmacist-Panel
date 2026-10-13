import type { Patient } from '../types/customer';

export const patients: Patient[] = [
{ id: 'PAT-2001', customerId: 'CUS-1001', name: 'Rohan Mehta', age: 38, gender: 'Male', relation: 'Self', allergies: [], conditions: ['Hypertension'] },
{ id: 'PAT-2002', customerId: 'CUS-1001', name: 'Kamla Mehta', age: 67, gender: 'Female', relation: 'Mother', weightKg: 62, allergies: ['Sulfa drugs'], conditions: ['Type 2 diabetes', 'Hypothyroidism'] },
{ id: 'PAT-2003', customerId: 'CUS-1002', name: 'Sneha Iyer', age: 31, gender: 'Female', relation: 'Self', allergies: [], conditions: [] },
{ id: 'PAT-2004', customerId: 'CUS-1002', name: 'Aarav Iyer', age: 6, gender: 'Male', relation: 'Son', weightKg: 21, allergies: [], conditions: ['Asthma'] },
{ id: 'PAT-2005', customerId: 'CUS-1003', name: 'Arjun Kapoor', age: 45, gender: 'Male', relation: 'Self', allergies: ['Penicillin'], conditions: ['Hyperlipidaemia'] },
{ id: 'PAT-2006', customerId: 'CUS-1004', name: 'Meera Nair', age: 52, gender: 'Female', relation: 'Self', allergies: [], conditions: ['Type 2 diabetes'] },
{ id: 'PAT-2007', customerId: 'CUS-1005', name: 'Kabir Singh', age: 29, gender: 'Male', relation: 'Self', allergies: [], conditions: [] },
{ id: 'PAT-2008', customerId: 'CUS-1006', name: 'Lakshmi Reddy', age: 61, gender: 'Female', relation: 'Self', allergies: [], conditions: ['Hypertension', 'Osteopenia'] },
{ id: 'PAT-2009', customerId: 'CUS-1006', name: 'Venkat Reddy', age: 66, gender: 'Male', relation: 'Spouse', allergies: [], conditions: ['Type 2 diabetes'] },
{ id: 'PAT-2010', customerId: 'CUS-1007', name: 'Imran Sheikh', age: 34, gender: 'Male', relation: 'Self', allergies: [], conditions: [] },
{ id: 'PAT-2011', customerId: 'CUS-1007', name: 'Zoya Sheikh', age: 3, gender: 'Female', relation: 'Daughter', weightKg: 14, allergies: [], conditions: [] },
{ id: 'PAT-2012', customerId: 'CUS-1008', name: 'Divya Joshi', age: 27, gender: 'Female', relation: 'Self', allergies: ['Ibuprofen'], conditions: [] },
{ id: 'PAT-2013', customerId: 'CUS-1009', name: 'Siddharth Bose', age: 41, gender: 'Male', relation: 'Self', allergies: [], conditions: ['GERD'] },
{ id: 'PAT-2014', customerId: 'CUS-1010', name: 'Ayesha Khan', age: 36, gender: 'Female', relation: 'Self', allergies: [], conditions: ['Hypothyroidism'] },
{ id: 'PAT-2015', customerId: 'CUS-1011', name: 'Vivek Patil', age: 58, gender: 'Male', relation: 'Self', allergies: [], conditions: ['Hypertension', 'Type 2 diabetes'] },
{ id: 'PAT-2016', customerId: 'CUS-1012', name: 'Neha Gupta', age: 24, gender: 'Female', relation: 'Self', allergies: [], conditions: ['Allergic rhinitis'] }];