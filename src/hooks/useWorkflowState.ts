import { useRef, useState } from 'react';
import { orders as seedOrders } from '../data/orders';
import { referrals as seedReferrals } from '../data/referrals';
import { customers } from '../data/customers';
import { pharmacist } from '../data/pharmacist';
import { defaultPreferences } from '../data/preferences';
import { buildOrderHistory, buildReferralActivity } from '../utils/seedHistory';
import { needsDoctorPrescription } from '../utils/clinical';
import { nowIso } from '../utils/datetime';
import type { ActorRole, HistoryEvent, Order, OrderStatus } from '../types/order';
import type { Referral, ReferralActivity, ReferralKind } from '../types/referral';
import type { CustomerNote } from '../types/customer';
import type { PharmacistProfile } from '../types/pharmacist';
import type { Preferences } from '../types/preferences';

const SIMULATED_LATENCY = 700;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export interface CallerReturnResult {
  destination: 'pharmacist' | 'doctor';
  doctorReferralId?: string;
}

/**
 * Local, in-memory workflow store. All mutations are simulated with a short latency and
 * guarded against duplicate submissions. Replace with API calls when a backend is available.
 */
export function useWorkflowState() {
  const [orders, setOrders] = useState<Order[]>(() =>
  seedOrders.map((o) => ({ ...o, history: buildOrderHistory(o, seedReferrals.filter((r) => r.orderId === o.id)) }))
  );
  const [referrals, setReferrals] = useState<Referral[]>(() =>
  seedReferrals.map((r) => ({ ...r, activity: buildReferralActivity(r) }))
  );
  const [customerNotes, setCustomerNotes] = useState<Record<string, CustomerNote[]>>(() =>
  Object.fromEntries(customers.map((c) => [c.id, c.notes]))
  );
  const [profile, setProfile] = useState<PharmacistProfile>(pharmacist);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const ordersRef = useRef(orders);
  ordersRef.current = orders;
  const referralsRef = useRef(referrals);
  referralsRef.current = referrals;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const inFlight = useRef(new Set<string>());

  async function run<T>(key: string, task: () => T): Promise<T> {
    if (inFlight.current.has(key)) throw new Error('This action is already being processed.');
    inFlight.current.add(key);
    try {
      await wait(SIMULATED_LATENCY);
      return task();
    } finally {
      inFlight.current.delete(key);
    }
  }

  function historyEvent(actor: string, role: ActorRole, action: string, note?: string): HistoryEvent {
    return { id: uid('h'), at: nowIso(), actor, role, action, note };
  }

  function activityEvent(actor: string, role: ActorRole, action: string): ReferralActivity {
    return { id: uid('a'), at: nowIso(), actor, role, action };
  }

  function patchOrder(id: string, fn: (o: Order) => Order) {
    setOrders((prev) => prev.map((o) => o.id === id ? fn(o) : o));
  }

  function patchReferral(id: string, fn: (r: Referral) => Referral) {
    setReferrals((prev) => prev.map((r) => r.id === id ? fn(r) : r));
  }

  function requireOrder(id: string, status?: OrderStatus): Order {
    const order = ordersRef.current.find((o) => o.id === id);
    if (!order) throw new Error('Order not found.');
    if (status && order.status !== status) throw new Error(`Order ${id} is no longer ${status.toLowerCase()}.`);
    return order;
  }

  function requireReferral(id: string): Referral {
    const ref = referralsRef.current.find((r) => r.id === id);
    if (!ref) throw new Error('Referral not found.');
    return ref;
  }

  function nextReferralId(kind: ReferralKind): string {
    const prefix = kind === 'doctor' ? 'REF-D-' : 'REF-C-';
    const max = referralsRef.current.
    filter((r) => r.kind === kind).
    reduce((m, r) => Math.max(m, Number(r.id.replace(prefix, '')) || 0), 1000);
    return `${prefix}${max + 1}`;
  }

  function createReferral(kind: ReferralKind, orderId: string, reason: string, details: string, by: string): Referral {
    const id = nextReferralId(kind);
    const at = nowIso();
    return {
      id,
      kind,
      orderId,
      reason,
      details: details || undefined,
      referredBy: by,
      referredByRole: 'Pharmacist',
      createdAt: at,
      updatedAt: at,
      status: kind === 'doctor' ? 'Pending Review' : 'Pending',
      notes: [],
      activity: [{ id: `${id}-a0`, at, actor: by, role: 'Pharmacist', action: `Referral created — sent to ${kind} queue` }]
    };
  }

  async function approveOrder(orderId: string, note?: string): Promise<void> {
    const order = requireOrder(orderId, 'Pending Approval');
    if (needsDoctorPrescription(order)) {
      throw new Error('A doctor-generated prescription is required before approving prescription medicines.');
    }
    await run(orderId, () => {
      const by = profileRef.current.name;
      const ev = historyEvent(by, 'Pharmacist', 'Verified and approved order', note);
      patchOrder(orderId, (o) => ({
        ...o,
        status: 'Approved',
        approval: { by, at: ev.at, note },
        fulfilment: 'Awaiting Packing',
        updatedAt: ev.at,
        history: [...o.history, ev]
      }));
    });
  }

  async function rejectOrder(orderId: string, reason: string, details?: string): Promise<void> {
    requireOrder(orderId, 'Pending Approval');
    await run(orderId, () => {
      const by = profileRef.current.name;
      const ev = historyEvent(by, 'Pharmacist', 'Rejected order', reason);
      patchOrder(orderId, (o) => ({
        ...o,
        status: 'Rejected',
        rejection: { by, at: ev.at, reason, details },
        updatedAt: ev.at,
        history: [...o.history, ev]
      }));
    });
  }

  async function referOrder(kind: ReferralKind, orderId: string, reason: string, details: string): Promise<string> {
    requireOrder(orderId, 'Pending Approval');
    return run(orderId, () => {
      const by = profileRef.current.name;
      const ref = createReferral(kind, orderId, reason, details, by);
      setReferrals((prev) => [ref, ...prev]);
      const ev = historyEvent(by, 'Pharmacist', `Referred to ${kind} (${ref.id})`, reason);
      patchOrder(orderId, (o) => ({
        ...o,
        status: kind === 'doctor' ? 'Doctor Review' : 'Caller Clarification',
        updatedAt: ev.at,
        history: [...o.history, ev]
      }));
      return ref.id;
    });
  }

  const referToDoctor = (orderId: string, reason: string, details: string) => referOrder('doctor', orderId, reason, details);
  const referToCaller = (orderId: string, reason: string, details: string) => referOrder('caller', orderId, reason, details);

  async function addReferralNote(referralId: string, text: string): Promise<void> {
    requireReferral(referralId);
    await run(`note-${referralId}`, () => {
      const by = profileRef.current.name;
      const at = nowIso();
      patchReferral(referralId, (r) => ({
        ...r,
        updatedAt: at,
        notes: [...r.notes, { id: uid('n'), at, author: by, role: 'Pharmacist', text }],
        activity: [...r.activity, activityEvent(by, 'Pharmacist', 'Added an internal note')]
      }));
    });
  }

  async function markReferralReviewed(referralId: string): Promise<void> {
    const ref = requireReferral(referralId);
    if (ref.kind !== 'doctor' || ref.status !== 'Responded') throw new Error('Only responded doctor referrals can be marked as reviewed.');
    if (ref.reviewedAt) throw new Error('This response has already been reviewed.');
    await run(referralId, () => {
      const by = profileRef.current.name;
      const ev = activityEvent(by, 'Pharmacist', 'Marked doctor response as reviewed');
      patchReferral(referralId, (r) => ({ ...r, reviewedAt: ev.at, updatedAt: ev.at, activity: [...r.activity, ev] }));
    });
  }

  async function returnDoctorReferral(referralId: string): Promise<void> {
    const ref = requireReferral(referralId);
    if (ref.status !== 'Responded' || !ref.reviewedAt) {
      throw new Error('The doctor response must be received and reviewed before returning the order.');
    }
    requireOrder(ref.orderId, 'Doctor Review');
    await run(referralId, () => {
      const by = profileRef.current.name;
      const ev = activityEvent(by, 'Pharmacist', 'Returned order for pharmacist review');
      patchReferral(referralId, (r) => ({ ...r, status: 'Returned for Pharmacist Review', updatedAt: ev.at, activity: [...r.activity, ev] }));
      patchOrder(ref.orderId, (o) => ({
        ...o,
        status: 'Pending Approval',
        updatedAt: ev.at,
        history: [...o.history, historyEvent(by, 'Pharmacist', 'Returned to pharmacist approval queue', `Doctor referral ${referralId}`)]
      }));
    });
  }

  async function completeCallerClarification(referralId: string, resolution: string): Promise<void> {
    const ref = requireReferral(referralId);
    if (ref.kind !== 'caller' || ref.status !== 'Pending' && ref.status !== 'In Progress') {
      throw new Error('This clarification is not open.');
    }
    await run(referralId, () => {
      const by = profileRef.current.name;
      const at = nowIso();
      patchReferral(referralId, (r) => ({
        ...r,
        status: 'Clarification Completed',
        updatedAt: at,
        notes: [...r.notes, { id: uid('n'), at, author: by, role: 'Pharmacist', text: resolution }],
        activity: [...r.activity, activityEvent(by, 'Pharmacist', 'Marked clarification as completed')]
      }));
    });
  }

  async function returnCallerReferral(referralId: string): Promise<CallerReturnResult> {
    const ref = requireReferral(referralId);
    if (ref.status !== 'Clarification Completed') throw new Error('Complete the clarification before returning the order.');
    const order = requireOrder(ref.orderId, 'Caller Clarification');
    const toDoctor = needsDoctorPrescription(order);
    return run(referralId, () => {
      const by = profileRef.current.name;
      const ev = activityEvent(by, 'Pharmacist', 'Returned order to workflow');
      patchReferral(referralId, (r) => ({ ...r, status: 'Returned to Workflow', updatedAt: ev.at, activity: [...r.activity, ev] }));
      if (toDoctor) {
        const docRef = createReferral(
          'doctor',
          order.id,
          'Prescription missing or incomplete',
          `Caller clarification ${referralId} completed. Prescription medicines require doctor review before pharmacist approval.`,
          by
        );
        setReferrals((prev) => [docRef, ...prev]);
        patchOrder(order.id, (o) => ({
          ...o,
          status: 'Doctor Review',
          updatedAt: ev.at,
          history: [...o.history, historyEvent(by, 'Pharmacist', `Referred to doctor (${docRef.id})`, 'Doctor review required after caller clarification')]
        }));
        return { destination: 'doctor' as const, doctorReferralId: docRef.id };
      }
      patchOrder(order.id, (o) => ({
        ...o,
        status: 'Pending Approval',
        updatedAt: ev.at,
        history: [...o.history, historyEvent(by, 'Pharmacist', 'Returned to pharmacist approval queue', `Caller referral ${referralId}`)]
      }));
      return { destination: 'pharmacist' as const };
    });
  }

  async function addCustomerNote(customerId: string, text: string): Promise<void> {
    await run(`cnote-${customerId}`, () => {
      const note: CustomerNote = { id: uid('cn'), at: nowIso(), author: profileRef.current.name, text };
      setCustomerNotes((prev) => ({ ...prev, [customerId]: [...(prev[customerId] ?? []), note] }));
    });
  }

  async function updateProfile(next: PharmacistProfile): Promise<void> {
    await run('profile', () => setProfile(next));
  }

  async function updatePreferences(next: Preferences): Promise<void> {
    await run('preferences', () => setPreferences(next));
  }

  return {
    orders,
    referrals,
    customerNotes,
    profile,
    preferences,
    approveOrder,
    rejectOrder,
    referToDoctor,
    referToCaller,
    addReferralNote,
    markReferralReviewed,
    returnDoctorReferral,
    completeCallerClarification,
    returnCallerReferral,
    addCustomerNote,
    updateProfile,
    updatePreferences
  };
}

export type WorkflowState = ReturnType<typeof useWorkflowState>;