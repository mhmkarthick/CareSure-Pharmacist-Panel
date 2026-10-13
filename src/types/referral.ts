import type { ActorRole } from './order';

export type ReferralKind = 'doctor' | 'caller';

export type DoctorReferralStatus =
'Pending Review' |
'In Review' |
'Responded' |
'Returned for Pharmacist Review';

export type CallerReferralStatus =
'Pending' |
'In Progress' |
'Clarification Completed' |
'Returned to Workflow';

export type ReferralStatus = DoctorReferralStatus | CallerReferralStatus;

export interface ReferralNote {
  id: string;
  at: string;
  author: string;
  role: ActorRole;
  text: string;
}

export interface ReferralActivity {
  id: string;
  at: string;
  actor: string;
  role: ActorRole;
  action: string;
}

export interface Referral {
  id: string;
  kind: ReferralKind;
  orderId: string;
  reason: string;
  details?: string;
  referredBy: string;
  referredByRole: ActorRole;
  createdAt: string;
  updatedAt: string;
  status: ReferralStatus;
  assignee?: string;
  reviewedAt?: string;
  notes: ReferralNote[];
  activity: ReferralActivity[];
}

export type SeedReferral = Omit<Referral, 'activity'>;