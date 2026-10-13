import type { HistoryEvent, SeedOrder } from '../types/order';
import type { ReferralActivity, SeedReferral } from '../types/referral';
import { getCustomer, getDoctor } from './lookups';
import { shiftIso } from './datetime';

/** Builds a plausible order timeline from the seed record's fields so history stays consistent with status. */
export function buildOrderHistory(order: SeedOrder, refs: SeedReferral[]): HistoryEvent[] {
  const events: HistoryEvent[] = [];
  const push = (at: string, actor: string, role: HistoryEvent['role'], action: string, note?: string) =>
  events.push({ id: `${order.id}-h${events.length}`, at, actor, role, action, note });

  push(
    order.placedAt,
    getCustomer(order.customerId)?.name ?? 'Customer',
    'Customer',
    `Placed ${order.type} order`,
    `${order.items.length} medicine${order.items.length === 1 ? '' : 's'}`
  );
  if (order.uploadedDocumentId) {
    push(shiftIso(order.placedAt, 1), 'OCR service', 'System', 'Prescription uploaded and text extracted');
  }
  if (order.type === 'Upload Prescription') {
    push(shiftIso(order.placedAt, 12), 'Caller desk', 'Caller', 'Order details confirmed with customer');
  }
  if (order.doctorPrescription) {
    const doc = getDoctor(order.doctorPrescription.doctorId);
    push(
      order.doctorPrescription.issuedAt,
      doc?.name ?? 'Doctor',
      'Doctor',
      `Generated prescription ${order.doctorPrescription.rxNumber}`,
      order.doctorPrescription.diagnosis
    );
  }
  const queuedAt = order.doctorPrescription ?
  shiftIso(order.doctorPrescription.issuedAt, 2) :
  shiftIso(order.placedAt, 25);
  push(queuedAt, 'Workflow', 'System', 'Queued for pharmacist approval');

  refs.forEach((r) => {
    push(
      r.createdAt,
      r.referredBy,
      r.referredByRole,
      r.kind === 'doctor' ? `Referred to doctor (${r.id})` : `Referred to caller (${r.id})`,
      r.reason
    );
    if (r.status === 'Returned for Pharmacist Review' || r.status === 'Returned to Workflow') {
      push(r.updatedAt, r.referredBy, 'Pharmacist', 'Returned to pharmacist approval queue');
    }
  });

  if (order.approval) {
    push(order.approval.at, order.approval.by, 'Pharmacist', 'Verified and approved order', order.approval.note);
    if (order.fulfilment && order.fulfilment !== 'Awaiting Packing') {
      push(shiftIso(order.approval.at, 90), 'Fulfilment', 'System', `Fulfilment status: ${order.fulfilment}`);
    }
  }
  if (order.rejection) {
    push(order.rejection.at, order.rejection.by, 'Pharmacist', 'Rejected order', order.rejection.reason);
  }
  return events.sort((a, b) => a.at.localeCompare(b.at));
}

export function buildReferralActivity(r: SeedReferral): ReferralActivity[] {
  const handlerRole = r.kind === 'doctor' ? 'Doctor' : 'Caller';
  const list: ReferralActivity[] = [];
  const push = (at: string, actor: string, role: ReferralActivity['role'], action: string) =>
  list.push({ id: `${r.id}-a${list.length}`, at, actor, role, action });

  push(r.createdAt, r.referredBy, r.referredByRole, `Referral created — sent to ${r.kind} queue`);
  if (r.assignee) push(shiftIso(r.createdAt, 25), r.assignee, handlerRole, 'Picked up for review');
  r.notes.forEach((n) => push(n.at, n.author, n.role, 'Added a note'));
  if (r.status === 'Responded' && r.assignee) push(r.updatedAt, r.assignee, 'Doctor', 'Responded to referral');
  if (r.status === 'Returned for Pharmacist Review') {
    if (r.assignee) push(shiftIso(r.updatedAt, -20), r.assignee, 'Doctor', 'Responded to referral');
    if (r.reviewedAt) push(r.reviewedAt, r.referredBy, 'Pharmacist', 'Marked doctor response as reviewed');
    push(r.updatedAt, r.referredBy, 'Pharmacist', 'Returned order for pharmacist review');
  }
  if (r.status === 'Clarification Completed' && r.assignee) {
    push(r.updatedAt, r.assignee, 'Caller', 'Marked clarification as completed');
  }
  if (r.status === 'Returned to Workflow') {
    if (r.assignee) push(shiftIso(r.updatedAt, -4), r.assignee, 'Caller', 'Marked clarification as completed');
    push(r.updatedAt, r.referredBy, 'Pharmacist', 'Returned order to workflow');
  }
  return list.sort((a, b) => a.at.localeCompare(b.at));
}