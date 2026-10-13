import React from 'react';
import { useParams } from 'react-router-dom';
import { TriangleAlertIcon } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useFormatters } from '../hooks/useFormatters';
import { useDataStatus } from '../hooks/useDataStatus';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { InfoItem } from '../components/ui/InfoItem';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { DetailSkeleton } from '../components/ui/DetailSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { RecordNotice } from '../components/order/RecordNotice';
import { ActivityTimeline, type TimelineEvent } from '../components/order/ActivityTimeline';
import { NotesPanel } from '../components/order/NotesPanel';
import { CustomerOrderHistory } from '../components/customers/CustomerOrderHistory';
import { getCustomer, patientsForCustomer } from '../utils/lookups';
import { computeBill } from '../utils/billing';

export function CustomerDetails() {
  const { customerId } = useParams();
  const { orders, customerNotes, addCustomerNote } = useAppState();
  const fmt = useFormatters();
  const { status, retry } = useDataStatus();
  const customer = customerId ? getCustomer(customerId) : undefined;

  if (status === 'loading') return <DetailSkeleton />;
  if (status === 'error') {
    return (
      <div className="rounded-[10px] border border-line bg-white">
        <ErrorState message="This customer couldn't be loaded." onRetry={retry} />
      </div>);

  }
  if (!customer) {
    return <RecordNotice title="Customer not found" message={`We couldn't find customer ${customerId}.`} to="/customers" actionLabel="Back to Customers" />;
  }

  const own = orders.filter((o) => o.customerId === customer.id);
  const linkedPatients = patientsForCustomer(customer.id);
  const lifetime = own.filter((o) => o.status === 'Approved').reduce((sum, o) => sum + computeBill(o).total, 0);
  const recentActivity: TimelineEvent[] = own.
  flatMap((o) => o.history.map((h) => ({ ...h, id: `${o.id}-${h.id}`, note: h.note ? `${o.id} · ${h.note}` : o.id }))).
  sort((a, b) => b.at.localeCompare(a.at)).
  slice(0, 6);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: 'Management' }, { label: 'Customers', to: '/customers' }, { label: customer.name }]}
        title={customer.name}
        meta={
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] text-muted">
            <span className="text-[13px] font-semibold tabular-nums text-ink">{customer.id}</span>
            <span aria-hidden>·</span>
            <span>Customer since {fmt.date(customer.registeredAt)}</span>
            <StatusBadge status={customer.status} />
          </div>
        } />
      

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title="Customer Information">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-3">
            <InfoItem label="Phone">
              <a href={`tel:${customer.phone.replace(/\s/g, '')}`} className="tabular-nums hover:underline">
                {customer.phone}
              </a>
            </InfoItem>
            <InfoItem label="Email">{customer.email ?? 'Not provided'}</InfoItem>
            <InfoItem label="City">{customer.city}</InfoItem>
            <InfoItem label="Preferred language">{customer.preferredLanguage}</InfoItem>
            <InfoItem label="Registered">{fmt.date(customer.registeredAt)}</InfoItem>
            <InfoItem label="Approved order value">
              <span className="font-semibold tabular-nums">{fmt.money(lifetime)}</span>
            </InfoItem>
          </dl>
        </Panel>
        <Panel title="Associated Patients" description={`${linkedPatients.length} linked to this account`}>
          <ul className="divide-y divide-line">
            {linkedPatients.map((p) =>
            <li key={p.id} className="flex items-start gap-3 px-4 py-3">
                <Avatar name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink">
                    {p.name} <span className="font-normal text-muted">· {p.relation}</span>
                  </p>
                  <p className="text-[12px] text-muted">
                    {p.age} yrs · {p.gender}
                    {p.conditions.length ? ` · ${p.conditions.join(', ')}` : ''}
                  </p>
                  {p.allergies.length > 0 &&
                <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-danger-ink">
                      <TriangleAlertIcon className="h-3.5 w-3.5" aria-hidden />
                      Allergic to {p.allergies.join(', ')}
                    </p>
                }
                </div>
                <span className="text-[11.5px] text-muted">{own.filter((o) => o.patientId === p.id).length} orders</span>
              </li>
            )}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <CustomerOrderHistory orders={own} status={status} onRetry={retry} />
        </div>
        <div className="space-y-4">
          <Panel title="Recent Order Activity">
            <div className="p-4">
              <ActivityTimeline events={recentActivity} emptyMessage="No order activity for this customer." />
            </div>
          </Panel>
          <NotesPanel
            title="Customer Notes"
            notes={customerNotes[customer.id] ?? []}
            onAdd={(text) => addCustomerNote(customer.id, text)}
            placeholder="Add a note about this customer…" />
          
        </div>
      </div>
    </div>);

}