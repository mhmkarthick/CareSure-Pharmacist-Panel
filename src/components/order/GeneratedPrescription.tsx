import React, { useState } from 'react';
import { toast } from 'sonner';
import { DownloadIcon, HourglassIcon, BadgeCheckIcon } from 'lucide-react';
import type { Order } from '../../types/order';
import type { Patient } from '../../types/customer';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useFormatters } from '../../hooks/useFormatters';
import { getDoctor, getMedicine } from '../../utils/lookups';
import { downloadPrescriptionPdf } from '../../utils/prescriptionPdf';

interface GeneratedPrescriptionProps {
  order: Order;
  patient?: Patient;
  className?: string;
}

export function GeneratedPrescription({ order, patient, className }: GeneratedPrescriptionProps) {
  const fmt = useFormatters();
  const rx = order.doctorPrescription;
  const doctor = rx ? getDoctor(rx.doctorId) : undefined;
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!rx || !doctor) return;
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 250));
      downloadPrescriptionPdf({ prescription: rx, doctor, patient, order });
      toast.success(`${rx.rxNumber}.pdf downloaded`);
    } catch {
      toast.error("Couldn't generate the PDF. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title="Doctor-Generated Prescription"
      description={rx ? `${rx.rxNumber} · Issued ${fmt.dateTime(rx.issuedAt)}` : 'Digital prescription from doctor review'}
      className={className}
      bodyClassName="flex flex-col"
      actions={
      rx &&
      <Button size="sm" icon={DownloadIcon} loading={busy} onClick={download}>
            Download PDF
          </Button>

      }>
      
      {!rx || !doctor ?
      <div className="flex flex-1 items-center justify-center bg-faint">
          <EmptyState
          icon={HourglassIcon}
          compact
          title={order.type === 'OTC' ? 'Not required for OTC orders' : 'Doctor prescription not generated'}
          message={
          order.type === 'OTC' ?
          'OTC medicines are dispensed without doctor review.' :
          "This order hasn't completed doctor review. Prescription medicines need a doctor-generated prescription before approval."
          } />
        
        </div> :

      <div className="min-h-[360px] flex-1 overflow-auto bg-canvas p-3">
          <article aria-label="Doctor-generated prescription" className="mx-auto max-w-[520px] rounded-md border border-line bg-white p-4 text-[12px] leading-relaxed text-ink shadow-sm">
            <header className="flex items-start justify-between gap-3 border-b-2 border-primary pb-3">
              <div>
                <p className="text-[13px] font-semibold text-primary-ink">CareSure Tele-Consult</p>
                <p className="flex items-center gap-1 text-[11px] text-muted">
                  <BadgeCheckIcon className="h-3 w-3" aria-hidden />
                  Digitally generated
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{doctor.name}</p>
                <p className="text-[11px] text-muted">{doctor.qualification}</p>
                <p className="text-[11px] text-muted">Reg. {doctor.registration}</p>
              </div>
            </header>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-line py-3">
              <div>
                <dt className="text-[11px] text-muted">Patient</dt>
                <dd className="font-medium">{patient?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted">Age / Sex</dt>
                <dd>{patient ? `${patient.age} yrs · ${patient.gender}` : '—'}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted">Prescription date</dt>
                <dd>{fmt.date(rx.issuedAt)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted">Specialty</dt>
                <dd>{doctor.specialty}</dd>
              </div>
            </dl>
            <div className="border-b border-line py-3">
              <p className="text-[11px] text-muted">Diagnosis</p>
              <p>{rx.diagnosis}</p>
            </div>
            <div className="py-3">
              <p className="mb-2 font-serif text-[18px] italic leading-none text-primary-ink" aria-hidden>
                Rx
              </p>
              <ol className="space-y-2.5">
                {order.items.map((item, i) => {
                const med = getMedicine(item.medicineId);
                if (!med) return null;
                return (
                  <li key={item.medicineId} className="flex gap-2">
                      <span className="w-4 shrink-0 tabular-nums text-muted">{i + 1}.</span>
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {med.name} {med.strength}
                        </p>
                        <p className="text-[11px] text-muted">
                          {med.form} · Qty {item.qty} × {med.pack}
                        </p>
                        {item.dosage && <p className="mt-0.5">{item.dosage}</p>}
                      </div>
                    </li>);

              })}
              </ol>
            </div>
            {rx.advice &&
          <div className="rounded bg-faint px-3 py-2">
                <p className="text-[11px] text-muted">Advice</p>
                <p>{rx.advice}</p>
              </div>
          }
            <footer className="mt-4 flex items-end justify-between border-t border-line pt-3 text-[11px] text-muted">
              <span>Digitally signed · {fmt.date(rx.issuedAt)}</span>
              <span className="font-medium text-ink">{doctor.name}</span>
            </footer>
          </article>
        </div>
      }
    </Panel>);

}