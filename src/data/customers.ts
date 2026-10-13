import type { Customer } from '../types/customer';

export const customers: Customer[] = [
{
  id: 'CUS-1001', name: 'Rohan Mehta', phone: '+91 98450 21734', email: 'rohan.mehta@example.com', registeredAt: '2025-03-14T10:20:00', status: 'Active', city: 'Bengaluru', preferredLanguage: 'English',
  notes: [{ id: 'CN-1001-1', at: '2026-09-14T11:00:00', author: 'Rahul Verma', text: 'Prefers morning delivery. Orders monthly diabetes and thyroid refills for his mother.' }]
},
{ id: 'CUS-1002', name: 'Sneha Iyer', phone: '+91 99001 44582', email: 'sneha.iyer@example.com', registeredAt: '2024-11-02T09:10:00', status: 'Active', city: 'Chennai', preferredLanguage: 'Tamil', notes: [] },
{ id: 'CUS-1003', name: 'Arjun Kapoor', phone: '+91 98111 60297', registeredAt: '2026-01-19T18:45:00', status: 'Active', city: 'Delhi', preferredLanguage: 'Hindi', notes: [] },
{ id: 'CUS-1004', name: 'Meera Nair', phone: '+91 94470 38815', email: 'meera.nair@example.com', registeredAt: '2025-07-08T12:30:00', status: 'Active', city: 'Kochi', preferredLanguage: 'Malayalam', notes: [] },
{
  id: 'CUS-1005', name: 'Kabir Singh', phone: '+91 98761 22048', email: 'kabir.s@example.com', registeredAt: '2025-05-23T16:05:00', status: 'Flagged', city: 'Chandigarh', preferredLanguage: 'Punjabi',
  notes: [{ id: 'CN-1005-1', at: '2026-10-04T12:10:00', author: 'Priya Menon', text: 'Flagged after two orders with expired prescriptions. Check prescription dates carefully.' }]
},
{ id: 'CUS-1006', name: 'Lakshmi Reddy', phone: '+91 99498 70163', email: 'lakshmi.reddy@example.com', registeredAt: '2024-09-30T08:50:00', status: 'Active', city: 'Hyderabad', preferredLanguage: 'Telugu', notes: [] },
{ id: 'CUS-1007', name: 'Imran Sheikh', phone: '+91 98200 51376', registeredAt: '2026-04-11T20:15:00', status: 'Active', city: 'Mumbai', preferredLanguage: 'Hindi', notes: [] },
{ id: 'CUS-1008', name: 'Divya Joshi', phone: '+91 97300 84521', email: 'divya.joshi@example.com', registeredAt: '2025-12-05T14:40:00', status: 'Active', city: 'Pune', preferredLanguage: 'Marathi', notes: [] },
{ id: 'CUS-1009', name: 'Siddharth Bose', phone: '+91 98310 67442', email: 'sid.bose@example.com', registeredAt: '2025-02-17T11:25:00', status: 'Inactive', city: 'Kolkata', preferredLanguage: 'Bengali', notes: [] },
{ id: 'CUS-1010', name: 'Ayesha Khan', phone: '+91 98712 30985', email: 'ayesha.khan@example.com', registeredAt: '2026-06-28T09:55:00', status: 'Active', city: 'Lucknow', preferredLanguage: 'Urdu', notes: [] },
{ id: 'CUS-1011', name: 'Vivek Patil', phone: '+91 98220 15739', email: 'vivek.patil@example.com', registeredAt: '2025-08-12T17:35:00', status: 'Active', city: 'Nashik', preferredLanguage: 'Marathi', notes: [] },
{ id: 'CUS-1012', name: 'Neha Gupta', phone: '+91 99100 42867', email: 'neha.gupta@example.com', registeredAt: '2026-02-03T13:00:00', status: 'Active', city: 'Jaipur', preferredLanguage: 'Hindi', notes: [] }];