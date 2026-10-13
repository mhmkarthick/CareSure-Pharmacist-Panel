import type { PrescriptionDocument } from '../types/order';

export const prescriptionDocuments: PrescriptionDocument[] = [
{
  id: 'DOC-UP-01',
  fileName: 'prescription_scan_2pages.jpg',
  uploadedAt: '2026-10-12T09:41:00',
  ocrStatus: 'Extracted',
  pages: ["/0d558c14-0e6d-40fa-ac15-235bba23d52a.jpg", "/e61dfc4c-ec75-4b32-847d-6ae68c0f9487.jpg"]



},
{
  id: 'DOC-UP-02',
  fileName: 'rx_photo_upload.jpg',
  uploadedAt: '2026-10-11T19:25:00',
  ocrStatus: 'Partially extracted',
  pages: ["/a921555a-9a2d-4b21-8b54-dc7a7c46f644.jpg"]
},
{
  id: 'DOC-UP-03',
  fileName: 'clinic_prescription.pdf.jpg',
  uploadedAt: '2026-10-11T17:47:00',
  ocrStatus: 'Extracted',
  pages: ["/72a59887-df6f-4043-b51c-febf197a91dc.jpg"]
},
{
  id: 'DOC-UP-04',
  fileName: 'IMG_20261011_prescription.jpg',
  uploadedAt: '2026-10-11T10:04:00',
  ocrStatus: 'Partially extracted',
  pages: ["/a921555a-9a2d-4b21-8b54-dc7a7c46f644.jpg"]
}];