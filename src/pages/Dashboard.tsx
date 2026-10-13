import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ClipboardListIcon,
  HourglassIcon,
  CircleCheckIcon,
  CircleXIcon,
  StethoscopeIcon,
  PhoneCallIcon,
  InboxIcon } from
'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useFormatters } from '../hooks/useFormatters';
import { useDataStatus } from '../hooks/useDataStatus';
import { PageHeader } from '../components/ui/PageHeader';
import { ButtonLink } from '../components/ui/ButtonLink';
import { Skeleton } from '../components/ui/Skeleton';
import { Panel } from '../components/ui/Panel';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { OrderTypeBadge } from '../components/ui/OrderTypeBadge';
import { ViewLink } from '../components/ui/ViewLink';
import { MobileRecordCard } from '../components/ui/MobileRecordCard';
import { Avatar } from '../components/ui/Avatar';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { AwaitingApprovalList } from '../components/dashboard/AwaitingApprovalList';
import { ReferralMiniList } from '../components/dashboard/ReferralMiniList';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { getCustomer, getPatient } from '../utils/lookups';
import { computeBill } from '../utils/billing';
import { isOpenReferral, orderPath } from '../utils/workflow';
import type { Order } from '../types/order';

export function Dashboard() {
  const { orders, referrals, profile } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();

  const data = isEmptyForced ? [] : orders;
  const refs = isEmptyForced ? [] : referrals;
  const byNewest = (a: {placedAt?: string;createdAt?: string;}, b: {placedAt?: string;createdAt?: string;}) =>
  (b.placedAt ?? b.createdAt ?? '').localeCompare(a.placedAt ?? a.createdAt ?? '');

  const pending = data.filter((o) => o.status === 'Pending Approval').sort(byNewest);
  const doctorOpen = refs.filter((r) => r.kind === 'doctor' && isOpenReferral(r)).sort(byNewest);
  const callerOpen = refs.filter((r) => r.kind === 'caller' && isOpenReferral(r)).sort(byNewest);
  const recent = [...data].sort(byNewest).slice(0, 7);
  const oldestPending = pending[pending.length - 1];

  const columns: Column<Order>[] = [
  { key: 'id', header: 'Order ID', render: (o) => <span className="font-semibold tabular-nums">{o.id}</span> },
  { key: 'customer', header: 'Customer', render: (o) => getCustomer(o.customerId)?.name },
  { key: 'patient', header: 'Patient', render: (o) => getPatient(o.patientId)?.name },
  { key: 'type', header: 'Order Type', render: (o) => <OrderTypeBadge type={o.type} /> },
  { key: 'date', header: 'Order Date', render: (o) => <span className="whitespace-nowrap">{fmt.date(o.placedAt)}</span> },
  { key: 'amount', header: 'Amount', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  { key: 'view', header: 'View Details', align: 'right', render: (o) => <ViewLink to={orderPath(o)} srLabel={o.id} /> }];


  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description={
        status === 'ready' ?
        `Welcome back, ${profile.name.split(' ')[0]}. ${pending.length} order${pending.length === 1 ? ' is' : 's are'} waiting for your review.` :
        `Welcome back, ${profile.name.split(' ')[0]}.`
        }
        actions={
        <>
            <span className="text-[12px] text-muted">{format(new Date(), 'EEEE, d MMMM yyyy')}</span>
            <Link to="/profile" aria-label="Open your profile" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Avatar name={profile.name} />
            </Link>
            <ButtonLink to="/orders/pending-approval" variant="primary" icon={HourglassIcon}>
              Review queue
            </ButtonLink>
          </>
        } />
      

      {status === 'error' ?
      <Panel>
          <ErrorState message="Dashboard data couldn't be loaded. Your queue is unaffected." onRetry={retry} />
        </Panel> :

      <>
          <section aria-label="Summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {status === 'loading' ?
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[92px] rounded-[10px]" />) :

          <>
                <SummaryCard label="Total Orders" value={data.length} to="/orders" icon={ClipboardListIcon} />
                <SummaryCard
              label="Pending Approval"
              value={pending.length}
              to="/orders/pending-approval"
              icon={HourglassIcon}
              emphasis
              hint={oldestPending ? `Oldest since ${fmt.date(oldestPending.placedAt)}` : 'Queue is clear'} />
            
                <SummaryCard label="Approved Orders" value={data.filter((o) => o.status === 'Approved').length} to="/orders/approved" icon={CircleCheckIcon} />
                <SummaryCard label="Rejected Orders" value={data.filter((o) => o.status === 'Rejected').length} to="/orders/rejected" icon={CircleXIcon} />
                <SummaryCard label="Doctor Referrals" value={doctorOpen.length} to="/referrals/doctor" icon={StethoscopeIcon} hint="Open" />
                <SummaryCard label="Caller Referrals" value={callerOpen.length} to="/referrals/caller" icon={PhoneCallIcon} hint="Open" />
              </>
          }
          </section>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="min-w-0 xl:col-span-2" aria-labelledby="recent-orders-title">
              <div className="mb-2 flex items-center justify-between">
                <h2 id="recent-orders-title" className="text-[15px] font-semibold text-ink">
                  Recent Orders
                </h2>
                <Link to="/orders" className="text-[12px] font-medium text-primary-ink hover:underline">
                  View all orders
                </Link>
              </div>
              <DataTable
              caption="Recent orders"
              columns={columns}
              rows={recent}
              rowKey={(o) => o.id}
              status={status}
              onRetry={retry}
              onRowClick={(o) => navigate(orderPath(o))}
              minWidth="min-w-[760px]"
              empty={<EmptyState icon={InboxIcon} title="No orders yet" message="New orders will appear here as customers place them." />}
              mobileCard={(o) =>
              <MobileRecordCard
                to={orderPath(o)}
                title={o.id}
                subtitle={`${getPatient(o.patientId)?.name} · ${o.type}`}
                badge={<StatusBadge status={o.status} />}
                fields={[
                { label: 'Customer', value: getCustomer(o.customerId)?.name },
                { label: 'Amount', value: fmt.money(computeBill(o).total) }]
                } />

              } />
            
            </section>
            <AwaitingApprovalList orders={pending.slice(0, 5)} total={pending.length} status={status} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ReferralMiniList kind="doctor" referrals={doctorOpen.slice(0, 4)} orders={data} total={doctorOpen.length} status={status} />
            <ReferralMiniList kind="caller" referrals={callerOpen.slice(0, 4)} orders={data} total={callerOpen.length} status={status} />
            <StatusDistribution orders={data} status={status} />
          </div>
        </>
      }
    </div>);

}