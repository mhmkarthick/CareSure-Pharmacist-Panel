import type { Order } from '../types/order';
import type { Referral, ReferralKind } from '../types/referral';

export function orderPath(order: Pick<Order, 'id' | 'status'>): string {
  switch (order.status) {
    case 'Pending Approval':
      return `/orders/pending-approval/${order.id}`;
    case 'Approved':
      return `/orders/approved/${order.id}`;
    case 'Rejected':
      return `/orders/rejected/${order.id}`;
    default:
      return `/orders/${order.id}`;
  }
}

export function referralPath(r: Pick<Referral, 'id' | 'kind'>): string {
  return `/referrals/${r.kind}/${r.id}`;
}

export function isOpenReferral(r: Pick<Referral, 'status'>): boolean {
  return r.status !== 'Returned for Pharmacist Review' && r.status !== 'Returned to Workflow';
}

export function activeReferralFor(order: Order, referrals: Referral[]): Referral | undefined {
  const kind: ReferralKind | null =
  order.status === 'Doctor Review' ? 'doctor' : order.status === 'Caller Clarification' ? 'caller' : null;
  if (!kind) return undefined;
  return referrals.
  filter((r) => r.orderId === order.id && r.kind === kind).
  sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}