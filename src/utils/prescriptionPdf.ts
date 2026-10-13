import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';
import type { Doctor, DoctorPrescription, Order } from '../types/order';
import type { Patient } from '../types/customer';
import { getMedicine } from './lookups';

interface PrescriptionPdfInput {
  prescription: DoctorPrescription;
  doctor: Doctor;
  patient?: Patient;
  order: Order;
}

/** Generates a PDF of the doctor-generated prescription from the order record and triggers a download. */
export function downloadPrescriptionPdf({ prescription, doctor, patient, order }: PrescriptionPdfInput): void {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 48;
  const right = 547;
  let y = 60;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(14, 124, 126);
  pdf.text('CareSure Tele-Consult', left, y);
  pdf.setFontSize(11);
  pdf.setTextColor(32, 43, 60);
  pdf.text(doctor.name, right, y, { align: 'right' });

  y += 14;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Digital prescription', left, y);
  pdf.text(doctor.qualification, right, y, { align: 'right' });
  y += 12;
  pdf.text(`${doctor.specialty} - Reg. ${doctor.registration}`, right, y, { align: 'right' });

  y += 12;
  pdf.setDrawColor(14, 124, 126);
  pdf.setLineWidth(1.5);
  pdf.line(left, y, right, y);

  y += 24;
  const info: Array<[string, string]> = [
  ['Patient', patient?.name ?? '-'],
  ['Age / Sex', patient ? `${patient.age} y / ${patient.gender}` : '-'],
  ['Prescription No.', prescription.rxNumber],
  ['Date', format(parseISO(prescription.issuedAt), 'dd MMM yyyy, HH:mm')],
  ['Order ID', order.id]];

  info.forEach(([label, value], i) => {
    const x = i % 2 === 0 ? left : 300;
    if (i % 2 === 0 && i > 0) y += 32;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(label, x, y);
    pdf.setFontSize(10);
    pdf.setTextColor(32, 43, 60);
    pdf.text(value, x, y + 13);
  });

  y += 44;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Diagnosis', left, y);
  pdf.setFontSize(10);
  pdf.setTextColor(32, 43, 60);
  const diag = pdf.splitTextToSize(prescription.diagnosis, right - left);
  pdf.text(diag, left, y + 13);
  y += 13 + diag.length * 12 + 18;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(14, 124, 126);
  pdf.text('Rx', left, y);
  y += 20;

  order.items.forEach((item, i) => {
    const med = getMedicine(item.medicineId);
    if (!med) return;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(32, 43, 60);
    pdf.text(`${i + 1}. ${med.name} ${med.strength}`, left, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`${med.form} - Qty ${item.qty} x ${med.pack}`, left + 14, y + 13);
    y += 26;
    if (item.dosage) {
      pdf.setTextColor(32, 43, 60);
      pdf.text(item.dosage, left + 14, y);
      y += 16;
    }
    y += 4;
  });

  if (prescription.advice) {
    y += 6;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Advice', left, y);
    pdf.setFontSize(10);
    pdf.setTextColor(32, 43, 60);
    const advice = pdf.splitTextToSize(prescription.advice, right - left);
    pdf.text(advice, left, y + 13);
    y += 13 + advice.length * 12;
  }

  const footerY = 780;
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(1);
  pdf.line(left, footerY, right, footerY);
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Digitally signed on ${format(parseISO(prescription.issuedAt), 'dd MMM yyyy')}`, left, footerY + 16);
  pdf.setTextColor(32, 43, 60);
  pdf.text(doctor.name, right, footerY + 16, { align: 'right' });

  pdf.save(`${prescription.rxNumber}.pdf`);
}