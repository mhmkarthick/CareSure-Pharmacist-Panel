import type { SeedOrder } from '../types/order';

export const orders: SeedOrder[] = [
// Pending approval
{
  id: 'CS-2026-10482', customerId: 'CUS-1001', patientId: 'PAT-2002', type: 'Upload Prescription', status: 'Pending Approval',
  placedAt: '2026-10-12T09:42:00', updatedAt: '2026-10-12T10:20:00', discount: 40, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-01',
  items: [
  { medicineId: 'MED-04', qty: 2, dosage: '1 tablet twice daily after meals' },
  { medicineId: 'MED-15', qty: 1, dosage: '1 tablet daily on an empty stomach' },
  { medicineId: 'MED-05', qty: 2, dosage: '1 tablet at night' },
  { medicineId: 'MED-18', qty: 2, dosage: '1 tablet daily after lunch' }],

  doctorPrescription: { rxNumber: 'RX-26-08812', doctorId: 'DOC-01', issuedAt: '2026-10-12T10:18:00', diagnosis: 'Type 2 diabetes mellitus with hypothyroidism — repeat prescription', advice: 'Monitor fasting glucose weekly. Review TSH after 6 weeks.' }
},
{
  id: 'CS-2026-10481', customerId: 'CUS-1004', patientId: 'PAT-2006', type: 'Add Rx', status: 'Pending Approval',
  placedAt: '2026-10-12T08:55:00', updatedAt: '2026-10-12T09:33:00', discount: 0, deliveryFee: 30,
  items: [
  { medicineId: 'MED-04', qty: 4, dosage: '1 tablet twice daily with meals' },
  { medicineId: 'MED-16', qty: 2, dosage: '1 tablet before breakfast' },
  { medicineId: 'MED-11', qty: 1, dosage: '1 capsule weekly for 8 weeks' }],

  doctorPrescription: { rxNumber: 'RX-26-08807', doctorId: 'DOC-02', issuedAt: '2026-10-12T09:31:00', diagnosis: 'Type 2 diabetes mellitus — 3-month follow-up', advice: 'Take metformin with meals. Repeat HbA1c in 3 months.' }
},
{
  id: 'CS-2026-10480', customerId: 'CUS-1003', patientId: 'PAT-2005', type: 'OTC', status: 'Pending Approval',
  placedAt: '2026-10-12T08:10:00', updatedAt: '2026-10-12T08:35:00', discount: 15, deliveryFee: 30,
  items: [{ medicineId: 'MED-01', qty: 2 }, { medicineId: 'MED-09', qty: 1 }, { medicineId: 'MED-19', qty: 1 }]
},
{
  id: 'CS-2026-10479', customerId: 'CUS-1007', patientId: 'PAT-2010', type: 'Upload Prescription', status: 'Pending Approval',
  placedAt: '2026-10-11T19:26:00', updatedAt: '2026-10-11T19:51:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-02',
  items: [
  { medicineId: 'MED-03', qty: 1, dosage: '1 tablet daily for 3 days' },
  { medicineId: 'MED-01', qty: 1, dosage: '1 tablet if fever above 100°F' },
  { medicineId: 'MED-17', qty: 1, dosage: '5 ml three times daily' }]

},
{
  id: 'CS-2026-10478', customerId: 'CUS-1002', patientId: 'PAT-2004', type: 'Upload Prescription', status: 'Pending Approval',
  placedAt: '2026-10-11T17:48:00', updatedAt: '2026-10-11T18:42:00', discount: 0, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-03',
  items: [
  { medicineId: 'MED-14', qty: 1, dosage: '2 puffs with spacer when needed' },
  { medicineId: 'MED-10', qty: 1, dosage: '1 tablet at bedtime' }],

  doctorPrescription: { rxNumber: 'RX-26-08779', doctorId: 'DOC-03', issuedAt: '2026-10-11T18:40:00', diagnosis: 'Mild persistent asthma', advice: 'Use inhaler with spacer. Review in 4 weeks.' }
},
{
  id: 'CS-2026-10477', customerId: 'CUS-1011', patientId: 'PAT-2015', type: 'Add Rx', status: 'Pending Approval',
  placedAt: '2026-10-11T15:12:00', updatedAt: '2026-10-11T16:00:00', discount: 60, deliveryFee: 0,
  items: [
  { medicineId: 'MED-07', qty: 2, dosage: '1 tablet every morning' },
  { medicineId: 'MED-06', qty: 2, dosage: '1 tablet every evening' },
  { medicineId: 'MED-04', qty: 2, dosage: '1 tablet twice daily after meals' }],

  doctorPrescription: { rxNumber: 'RX-26-08771', doctorId: 'DOC-01', issuedAt: '2026-10-11T15:58:00', diagnosis: 'Essential hypertension with type 2 diabetes mellitus', advice: 'Low-salt diet. Keep a home BP log twice daily.' }
},
{
  id: 'CS-2026-10476', customerId: 'CUS-1012', patientId: 'PAT-2016', type: 'OTC', status: 'Pending Approval',
  placedAt: '2026-10-11T12:40:00', updatedAt: '2026-10-11T13:05:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-09', qty: 2 }, { medicineId: 'MED-13', qty: 1 }]
},
{
  id: 'CS-2026-10475', customerId: 'CUS-1006', patientId: 'PAT-2009', type: 'Upload Prescription', status: 'Pending Approval',
  placedAt: '2026-10-11T10:05:00', updatedAt: '2026-10-11T11:04:00', discount: 100, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-04',
  items: [
  { medicineId: 'MED-22', qty: 2, dosage: '12 units subcutaneously at bedtime' },
  { medicineId: 'MED-04', qty: 3, dosage: '1 tablet twice daily after meals' }],

  doctorPrescription: { rxNumber: 'RX-26-08752', doctorId: 'DOC-02', issuedAt: '2026-10-11T11:02:00', diagnosis: 'Type 2 diabetes mellitus on basal insulin', advice: 'Store insulin refrigerated. Titrate only as advised.' }
},
{
  id: 'CS-2026-10474', customerId: 'CUS-1010', patientId: 'PAT-2014', type: 'Add Rx', status: 'Pending Approval',
  placedAt: '2026-10-10T18:30:00', updatedAt: '2026-10-11T10:05:00', discount: 0, deliveryFee: 30,
  items: [
  { medicineId: 'MED-15', qty: 1, dosage: '1 tablet daily, 30 min before breakfast' },
  { medicineId: 'MED-11', qty: 1, dosage: '1 capsule weekly for 8 weeks' }],

  doctorPrescription: { rxNumber: 'RX-26-08731', doctorId: 'DOC-01', issuedAt: '2026-10-10T19:02:00', diagnosis: 'Hypothyroidism; vitamin D deficiency', advice: 'Take levothyroxine on an empty stomach.' }
},

// With doctor
{
  id: 'CS-2026-10473', customerId: 'CUS-1005', patientId: 'PAT-2007', type: 'Upload Prescription', status: 'Doctor Review',
  placedAt: '2026-10-10T16:20:00', updatedAt: '2026-10-10T17:05:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-02',
  items: [
  { medicineId: 'MED-21', qty: 2, dosage: '1 tablet twice daily' },
  { medicineId: 'MED-12', qty: 2, dosage: '1 tablet after food if needed' }]

},
{
  id: 'CS-2026-10472', customerId: 'CUS-1008', patientId: 'PAT-2012', type: 'Add Rx', status: 'Doctor Review',
  placedAt: '2026-10-10T11:45:00', updatedAt: '2026-10-10T13:05:00', discount: 0, deliveryFee: 30,
  items: [
  { medicineId: 'MED-02', qty: 2, dosage: '1 capsule three times daily for 5 days' },
  { medicineId: 'MED-12', qty: 1, dosage: '1 tablet twice daily after food' }],

  doctorPrescription: { rxNumber: 'RX-26-08716', doctorId: 'DOC-02', issuedAt: '2026-10-10T12:10:00', diagnosis: 'Acute bacterial tonsillitis', advice: 'Complete the full antibiotic course.' }
},
{
  id: 'CS-2026-10471', customerId: 'CUS-1002', patientId: 'PAT-2003', type: 'Upload Prescription', status: 'Doctor Review',
  placedAt: '2026-10-09T14:30:00', updatedAt: '2026-10-10T09:20:00', discount: 20, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-03',
  items: [
  { medicineId: 'MED-08', qty: 2, dosage: '1 tablet before breakfast' },
  { medicineId: 'MED-03', qty: 1, dosage: '1 tablet daily for 3 days' }],

  doctorPrescription: { rxNumber: 'RX-26-08698', doctorId: 'DOC-01', issuedAt: '2026-10-09T14:58:00', diagnosis: 'Lower respiratory tract infection with gastritis', advice: 'Plenty of fluids. Return if fever persists beyond 3 days.' }
},
{
  id: 'CS-2026-10470', customerId: 'CUS-1009', patientId: 'PAT-2013', type: 'Add Rx', status: 'Doctor Review',
  placedAt: '2026-10-09T10:10:00', updatedAt: '2026-10-09T11:00:00', discount: 0, deliveryFee: 30,
  items: [
  { medicineId: 'MED-08', qty: 3, dosage: '1 tablet before breakfast' },
  { medicineId: 'MED-10', qty: 1, dosage: '1 tablet at bedtime' }],

  doctorPrescription: { rxNumber: 'RX-26-08684', doctorId: 'DOC-02', issuedAt: '2026-10-09T10:42:00', diagnosis: 'Gastro-oesophageal reflux disease; allergic rhinitis' }
},

// With caller
{
  id: 'CS-2026-10469', customerId: 'CUS-1003', patientId: 'PAT-2005', type: 'Upload Prescription', status: 'Caller Clarification',
  placedAt: '2026-10-09T09:00:00', updatedAt: '2026-10-09T09:40:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-01',
  items: [
  { medicineId: 'MED-05', qty: 2, dosage: '1 tablet at night' },
  { medicineId: 'MED-02', qty: 1, dosage: '1 capsule three times daily' }]

},
{
  id: 'CS-2026-10468', customerId: 'CUS-1007', patientId: 'PAT-2011', type: 'OTC', status: 'Caller Clarification',
  placedAt: '2026-10-08T20:15:00', updatedAt: '2026-10-09T10:30:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-17', qty: 1 }, { medicineId: 'MED-13', qty: 2 }]
},
{
  id: 'CS-2026-10467', customerId: 'CUS-1011', patientId: 'PAT-2015', type: 'Upload Prescription', status: 'Caller Clarification',
  placedAt: '2026-10-08T13:40:00', updatedAt: '2026-10-09T11:20:00', discount: 0, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-04',
  items: [{ medicineId: 'MED-07', qty: 3, dosage: '1 tablet every morning' }]
},
{
  id: 'CS-2026-10466', customerId: 'CUS-1012', patientId: 'PAT-2016', type: 'OTC', status: 'Caller Clarification',
  placedAt: '2026-10-08T11:05:00', updatedAt: '2026-10-08T11:30:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-09', qty: 1 }, { medicineId: 'MED-19', qty: 2 }]
},

// Approved
{
  id: 'CS-2026-10465', customerId: 'CUS-1001', patientId: 'PAT-2001', type: 'Add Rx', status: 'Approved',
  placedAt: '2026-10-08T09:30:00', updatedAt: '2026-10-08T15:40:00', discount: 30, deliveryFee: 0,
  items: [
  { medicineId: 'MED-07', qty: 2, dosage: '1 tablet every morning' },
  { medicineId: 'MED-06', qty: 1, dosage: '1 tablet every evening' }],

  doctorPrescription: { rxNumber: 'RX-26-08640', doctorId: 'DOC-01', issuedAt: '2026-10-08T10:05:00', diagnosis: 'Essential hypertension', advice: 'Reduce salt intake. Review in 3 months.' },
  approval: { by: 'Priya Menon', at: '2026-10-08T12:10:00' }, fulfilment: 'Out for Delivery'
},
{
  id: 'CS-2026-10464', customerId: 'CUS-1004', patientId: 'PAT-2006', type: 'OTC', status: 'Approved',
  placedAt: '2026-10-07T16:45:00', updatedAt: '2026-10-08T11:00:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-11', qty: 1 }, { medicineId: 'MED-18', qty: 2 }],
  approval: { by: 'Rahul Verma', at: '2026-10-07T18:00:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10463', customerId: 'CUS-1006', patientId: 'PAT-2008', type: 'Upload Prescription', status: 'Approved',
  placedAt: '2026-10-07T11:20:00', updatedAt: '2026-10-07T15:05:00', discount: 25, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-03',
  items: [
  { medicineId: 'MED-06', qty: 2, dosage: '1 tablet every morning' },
  { medicineId: 'MED-18', qty: 2, dosage: '1 tablet daily after lunch' }],

  doctorPrescription: { rxNumber: 'RX-26-08611', doctorId: 'DOC-02', issuedAt: '2026-10-07T12:00:00', diagnosis: 'Hypertension; osteopenia' },
  approval: { by: 'Priya Menon', at: '2026-10-07T13:35:00', note: 'Strengths match uploaded prescription.' }, fulfilment: 'Packing'
},
{
  id: 'CS-2026-10462', customerId: 'CUS-1002', patientId: 'PAT-2004', type: 'Add Rx', status: 'Approved',
  placedAt: '2026-10-06T15:00:00', updatedAt: '2026-10-07T12:00:00', discount: 0, deliveryFee: 0,
  items: [{ medicineId: 'MED-14', qty: 1, dosage: '2 puffs with spacer when needed' }],
  doctorPrescription: { rxNumber: 'RX-26-08590', doctorId: 'DOC-03', issuedAt: '2026-10-06T15:40:00', diagnosis: 'Mild persistent asthma — inhaler refill' },
  approval: { by: 'Priya Menon', at: '2026-10-06T18:20:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10461', customerId: 'CUS-1008', patientId: 'PAT-2012', type: 'OTC', status: 'Approved',
  placedAt: '2026-10-06T10:30:00', updatedAt: '2026-10-06T19:00:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-01', qty: 1 }, { medicineId: 'MED-13', qty: 1 }],
  approval: { by: 'Rahul Verma', at: '2026-10-06T11:15:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10460', customerId: 'CUS-1010', patientId: 'PAT-2014', type: 'Upload Prescription', status: 'Approved',
  placedAt: '2026-10-05T17:40:00', updatedAt: '2026-10-06T17:30:00', discount: 0, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-04',
  items: [{ medicineId: 'MED-15', qty: 2, dosage: '1 tablet daily, 30 min before breakfast' }],
  doctorPrescription: { rxNumber: 'RX-26-08562', doctorId: 'DOC-01', issuedAt: '2026-10-05T18:05:00', diagnosis: 'Hypothyroidism — refill' },
  approval: { by: 'Priya Menon', at: '2026-10-06T09:30:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10459', customerId: 'CUS-1011', patientId: 'PAT-2015', type: 'Add Rx', status: 'Approved',
  placedAt: '2026-10-05T13:15:00', updatedAt: '2026-10-06T10:00:00', discount: 40, deliveryFee: 0,
  items: [
  { medicineId: 'MED-16', qty: 2, dosage: '1 tablet before breakfast' },
  { medicineId: 'MED-04', qty: 2, dosage: '1 tablet twice daily after meals' }],

  doctorPrescription: { rxNumber: 'RX-26-08549', doctorId: 'DOC-02', issuedAt: '2026-10-05T13:50:00', diagnosis: 'Type 2 diabetes mellitus' },
  approval: { by: 'Priya Menon', at: '2026-10-05T15:10:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10458', customerId: 'CUS-1003', patientId: 'PAT-2005', type: 'OTC', status: 'Approved',
  placedAt: '2026-10-04T19:05:00', updatedAt: '2026-10-05T14:00:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-12', qty: 1 }, { medicineId: 'MED-20', qty: 1 }],
  approval: { by: 'Rahul Verma', at: '2026-10-04T20:00:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10457', customerId: 'CUS-1001', patientId: 'PAT-2002', type: 'Upload Prescription', status: 'Approved',
  placedAt: '2026-10-03T11:00:00', updatedAt: '2026-10-04T12:00:00', discount: 35, deliveryFee: 0, uploadedDocumentId: 'DOC-UP-01',
  items: [
  { medicineId: 'MED-04', qty: 2, dosage: '1 tablet twice daily after meals' },
  { medicineId: 'MED-15', qty: 1, dosage: '1 tablet daily on an empty stomach' }],

  doctorPrescription: { rxNumber: 'RX-26-08502', doctorId: 'DOC-01', issuedAt: '2026-10-03T11:40:00', diagnosis: 'Type 2 diabetes mellitus with hypothyroidism' },
  approval: { by: 'Priya Menon', at: '2026-10-03T15:00:00' }, fulfilment: 'Delivered'
},
{
  id: 'CS-2026-10456', customerId: 'CUS-1006', patientId: 'PAT-2009', type: 'OTC', status: 'Approved',
  placedAt: '2026-10-02T16:30:00', updatedAt: '2026-10-03T13:00:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-19', qty: 1 }, { medicineId: 'MED-18', qty: 1 }],
  approval: { by: 'Rahul Verma', at: '2026-10-02T17:10:00' }, fulfilment: 'Delivered'
},

// Rejected
{
  id: 'CS-2026-10455', customerId: 'CUS-1005', patientId: 'PAT-2007', type: 'Upload Prescription', status: 'Rejected',
  placedAt: '2026-10-04T09:20:00', updatedAt: '2026-10-04T12:00:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-02',
  items: [
  { medicineId: 'MED-03', qty: 2, dosage: '1 tablet daily' },
  { medicineId: 'MED-21', qty: 1, dosage: '1 tablet twice daily' }],

  rejection: { by: 'Priya Menon', at: '2026-10-04T12:00:00', reason: 'Prescription expired', details: 'Uploaded prescription is dated more than 6 months before the order date. Customer advised to upload a current prescription.' }
},
{
  id: 'CS-2026-10454', customerId: 'CUS-1009', patientId: 'PAT-2013', type: 'OTC', status: 'Rejected',
  placedAt: '2026-10-03T15:30:00', updatedAt: '2026-10-03T16:05:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-17', qty: 6 }],
  rejection: { by: 'Rahul Verma', at: '2026-10-03T16:05:00', reason: 'Quantity exceeds permitted limit', details: 'Six bottles of cough syrup exceed the OTC dispensing limit of two per order.' }
},
{
  id: 'CS-2026-10453', customerId: 'CUS-1007', patientId: 'PAT-2010', type: 'Add Rx', status: 'Rejected',
  placedAt: '2026-10-02T18:00:00', updatedAt: '2026-10-02T20:10:00', discount: 0, deliveryFee: 30,
  items: [{ medicineId: 'MED-21', qty: 1 }, { medicineId: 'MED-12', qty: 1 }],
  rejection: { by: 'Priya Menon', at: '2026-10-02T20:10:00', reason: 'Customer requested cancellation', details: 'Customer called support and asked to cancel before the doctor consultation.' }
},
{
  id: 'CS-2026-10452', customerId: 'CUS-1012', patientId: 'PAT-2016', type: 'Upload Prescription', status: 'Rejected',
  placedAt: '2026-10-01T14:15:00', updatedAt: '2026-10-01T16:00:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-04',
  items: [{ medicineId: 'MED-10', qty: 2, dosage: '1 tablet at bedtime' }],
  rejection: { by: 'Priya Menon', at: '2026-10-01T16:00:00', reason: 'Prescription illegible or incomplete', details: 'Medicine strength and doctor registration number are not readable.' }
},
{
  id: 'CS-2026-10451', customerId: 'CUS-1008', patientId: 'PAT-2012', type: 'Upload Prescription', status: 'Rejected',
  placedAt: '2026-09-30T11:45:00', updatedAt: '2026-09-30T13:20:00', discount: 0, deliveryFee: 30, uploadedDocumentId: 'DOC-UP-03',
  items: [{ medicineId: 'MED-02', qty: 1 }, { medicineId: 'MED-12', qty: 2 }],
  rejection: { by: 'Rahul Verma', at: '2026-09-30T13:20:00', reason: 'Patient details do not match prescription', details: 'Prescription was issued for a different patient name and age.' }
}];