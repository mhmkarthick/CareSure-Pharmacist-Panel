import React from 'react';
import { HeartPulseIcon, TriangleAlertIcon } from 'lucide-react';
import type { Patient } from '../../types/customer';
import { InfoItem } from '../ui/InfoItem';

export function PatientDetailsCard({ patient }: {patient?: Patient;}) {
  return (
    <section className="rounded-[10px] border border-line bg-white px-4 py-3" aria-label="Patient details">
      <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <HeartPulseIcon className="h-4 w-4 text-muted" aria-hidden />
        Patient Details <span className="font-normal text-muted">— Prescription For</span>
      </h2>
      {patient ?
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
          <InfoItem label="Patient">
            <span className="font-medium">{patient.name}</span>
          </InfoItem>
          <InfoItem label="Age / Sex">
            {patient.age} yrs · {patient.gender}
            {patient.weightKg ? ` · ${patient.weightKg} kg` : ''}
          </InfoItem>
          <InfoItem label="Relation">{patient.relation}</InfoItem>
          <InfoItem label="Allergies">
            {patient.allergies.length ?
          <span className="inline-flex items-center gap-1 font-medium text-danger-ink">
                <TriangleAlertIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {patient.allergies.join(', ')}
              </span> :

          'None recorded'
          }
          </InfoItem>
          {patient.conditions.length > 0 &&
        <InfoItem label="Conditions" className="col-span-2 sm:col-span-4">
              {patient.conditions.join(' · ')}
            </InfoItem>
        }
        </dl> :

      <p className="text-[13px] text-muted">Patient record unavailable.</p>
      }
    </section>);

}