import type { SeedReferral } from '../types/referral';

export const referrals: SeedReferral[] = [
// Doctor referrals
{
  id: 'REF-D-1006', kind: 'doctor', orderId: 'CS-2026-10473', status: 'Pending Review',
  reason: 'Prescription missing or incomplete', details: 'Cefixime course length is not legible on the uploaded prescription. Please confirm the duration or issue a digital prescription.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-10T17:05:00', updatedAt: '2026-10-10T17:05:00', notes: []
},
{
  id: 'REF-D-1005', kind: 'doctor', orderId: 'CS-2026-10472', status: 'In Review', assignee: 'Dr. Vikram Sethi',
  reason: 'Possible allergy conflict', details: 'Prescription includes ibuprofen, but the patient profile records an ibuprofen allergy. Please confirm an alternative analgesic.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-10T12:30:00', updatedAt: '2026-10-10T13:05:00', notes: []
},
{
  id: 'REF-D-1003', kind: 'doctor', orderId: 'CS-2026-10471', status: 'Responded', assignee: 'Dr. Ananya Rao',
  reason: 'Dosage clarification', details: 'Confirm azithromycin dose and duration — the uploaded prescription reads 250 mg while the digital prescription shows 500 mg.',
  referredBy: 'Rahul Verma', referredByRole: 'Pharmacist', createdAt: '2026-10-09T15:10:00', updatedAt: '2026-10-10T09:20:00',
  notes: [{ id: 'REF-D-1003-n1', at: '2026-10-10T09:20:00', author: 'Dr. Ananya Rao', role: 'Doctor', text: 'Confirmed: azithromycin 500 mg once daily for 3 days. The digital prescription is correct; no change to pantoprazole.' }]
},
{
  id: 'REF-D-1002', kind: 'doctor', orderId: 'CS-2026-10470', status: 'Pending Review',
  reason: 'Quantity exceeds prescribed duration', details: 'Three strips of pantoprazole requested against a 30-day course. Please confirm the intended duration.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-09T11:00:00', updatedAt: '2026-10-09T11:00:00', notes: []
},
{
  id: 'REF-D-1004', kind: 'doctor', orderId: 'CS-2026-10474', status: 'Returned for Pharmacist Review', assignee: 'Dr. Ananya Rao',
  reason: 'Strength verification', details: 'Verify levothyroxine 50 mcg against the most recent TSH report.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-10T19:00:00', updatedAt: '2026-10-11T10:05:00', reviewedAt: '2026-10-11T10:00:00',
  notes: [{ id: 'REF-D-1004-n1', at: '2026-10-11T09:40:00', author: 'Dr. Ananya Rao', role: 'Doctor', text: 'Strength 50 mcg confirmed against the TSH report shared by the patient on 8 Oct.' }]
},
{
  id: 'REF-D-1001', kind: 'doctor', orderId: 'CS-2026-10460', status: 'Returned for Pharmacist Review', assignee: 'Dr. Ananya Rao',
  reason: 'Quantity exceeds prescribed duration', details: 'Customer requested a 60-day supply; the prescription states 30 days.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-05T18:10:00', updatedAt: '2026-10-06T09:05:00', reviewedAt: '2026-10-06T09:00:00',
  notes: [{ id: 'REF-D-1001-n1', at: '2026-10-06T08:45:00', author: 'Dr. Ananya Rao', role: 'Doctor', text: 'A 60-day supply is appropriate. Prescription updated.' }]
},

// Caller referrals
{
  id: 'REF-C-1006', kind: 'caller', orderId: 'CS-2026-10469', status: 'Pending',
  reason: 'Patient mismatch', details: 'The name on the uploaded prescription does not match the selected patient (Arjun Kapoor). Confirm who the medicines are for.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-09T09:40:00', updatedAt: '2026-10-09T09:40:00', notes: []
},
{
  id: 'REF-C-1005', kind: 'caller', orderId: 'CS-2026-10468', status: 'In Progress', assignee: 'Sana Fernandes',
  reason: 'Pediatric dosing details', details: "Confirm the child's current age and weight before dispensing cough syrup.",
  referredBy: 'Rahul Verma', referredByRole: 'Pharmacist', createdAt: '2026-10-08T20:50:00', updatedAt: '2026-10-09T10:30:00',
  notes: [{ id: 'REF-C-1005-n1', at: '2026-10-09T10:30:00', author: 'Sana Fernandes', role: 'Caller', text: 'First call unanswered. Will retry at 12:00.' }]
},
{
  id: 'REF-C-1004', kind: 'caller', orderId: 'CS-2026-10467', status: 'Clarification Completed', assignee: 'Sana Fernandes',
  reason: 'Incomplete delivery address', details: 'Address is missing flat number and landmark; customer could not be reached by SMS.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-08T14:10:00', updatedAt: '2026-10-09T11:20:00',
  notes: [{ id: 'REF-C-1004-n1', at: '2026-10-09T11:20:00', author: 'Sana Fernandes', role: 'Caller', text: 'Customer confirmed full address (Flat 4B, Ganga Residency, near Gangapur Road). Order updated.' }]
},
{
  id: 'REF-C-1003', kind: 'caller', orderId: 'CS-2026-10466', status: 'Pending',
  reason: 'Quantity change requested', details: 'Customer asked support chat to increase multivitamin to 3 strips. Confirm before review.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-08T11:30:00', updatedAt: '2026-10-08T11:30:00', notes: []
},
{
  id: 'REF-C-1002', kind: 'caller', orderId: 'CS-2026-10457', status: 'Returned to Workflow', assignee: 'Rakesh Pillai',
  reason: 'Customer unreachable — confirm contact', details: 'Primary number unreachable; confirm an alternate contact for delivery.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-03T12:00:00', updatedAt: '2026-10-03T13:10:00',
  notes: [{ id: 'REF-C-1002-n1', at: '2026-10-03T13:05:00', author: 'Rakesh Pillai', role: 'Caller', text: 'Alternate number +91 98450 21000 confirmed with the customer.' }]
},
{
  id: 'REF-C-1001', kind: 'caller', orderId: 'CS-2026-10462', status: 'Returned to Workflow', assignee: 'Rakesh Pillai',
  reason: 'Other order clarification', details: 'Confirm whether the customer already has a spacer for the inhaler.',
  referredBy: 'Priya Menon', referredByRole: 'Pharmacist', createdAt: '2026-10-06T15:50:00', updatedAt: '2026-10-06T17:30:00',
  notes: [{ id: 'REF-C-1001-n1', at: '2026-10-06T17:25:00', author: 'Rakesh Pillai', role: 'Caller', text: 'Customer already has a spacer; no additional item needed.' }]
}];