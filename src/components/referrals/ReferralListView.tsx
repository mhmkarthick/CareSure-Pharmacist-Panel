import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PhoneCallIcon, SearchXIcon, StethoscopeIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { useFormatters } from '../../hooks/useFormatters';
import { useDataStatus } from '../../hooks/useDataStatus';
import { useTableState } from '../../hooks/useTableState';
import { PageHeader } from '../ui/PageHeader';
import { ListToolbar } from '../ui/ListToolbar';
import { SearchField } from '../ui/SearchField';
import { FilterSelect } from '../ui/FilterSelect';
import { DateRangeFilter } from '../ui/DateRangeFilter';
import { DataTable, type Column } from '../ui/DataTable';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { ViewLink } from '../ui/ViewLink';
import { MobileRecordCard } from '../ui/MobileRecordCard';
import { PersonCell } from '../ui/PersonCell';
import { callerReferralStatusOptions, doctorReferralStatusOptions } from '../../data/filterOptions';
import { callerReferralReasons, doctorReferralReasons } from '../../data/workflowReasons';
import { getCustomer, getPatient } from '../../utils/lookups';
import { isOpenReferral, referralPath } from '../../utils/workflow';
import type { Referral, ReferralKind } from '../../types/referral';
import type { Order } from '../../types/order';

const config = {
  doctor: {
    title: 'Doctor Referrals',
    description: 'Orders referred to a doctor for medical clarification or prescription review.',
    reasonHeader: 'Referral Reason',
    statusOptions: doctorReferralStatusOptions,
    reasons: doctorReferralReasons,
    icon: StethoscopeIcon,
    empty: 'No doctor referrals'
  },
  caller: {
    title: 'Caller Referrals',
    description: 'Orders routed to the caller desk for customer or order clarification.',
    reasonHeader: 'Clarification Reason',
    statusOptions: callerReferralStatusOptions,
    reasons: callerReferralReasons,
    icon: PhoneCallIcon,
    empty: 'No caller referrals'
  }
};

export function ReferralListView({ kind }: {kind: ReferralKind;}) {
  const c = config[kind];
  const { referrals, orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();
  const list = isEmptyForced ? [] : referrals.filter((r) => r.kind === kind);
  const orderOf = (r: Referral): Order | undefined => orders.find((o) => o.id === r.orderId);
  const openCount = list.filter(isOpenReferral).length;

  const table = useTableState<Referral>({
    data: list,
    search: (r) => {
      const o = orderOf(r);
      return `${r.id} ${r.orderId} ${r.reason} ${o ? getCustomer(o.customerId)?.name : ''} ${o ? getPatient(o.patientId)?.name : ''}`;
    },
    filters: [
    { key: 'status', match: (r, v) => v === 'open' ? isOpenReferral(r) : r.status === v },
    { key: 'reason', match: (r, v) => r.reason === v }],

    dateOf: (r) => r.createdAt,
    sorters: {
      id: (r) => r.id,
      orderId: (r) => r.orderId,
      createdAt: (r) => r.createdAt,
      status: (r) => r.status,
      by: (r) => r.referredBy
    },
    initialSort: { key: 'createdAt', direction: 'desc' }
  });

  const columns: Column<Referral>[] = [
  { key: 'id', header: 'Referral ID', sortKey: 'id', render: (r) => <span className="font-semibold tabular-nums">{r.id}</span> },
  {
    key: 'order',
    header: 'Order ID',
    sortKey: 'orderId',
    render: (r) =>
    <Link to={`/orders/${r.orderId}`} className="tabular-nums text-primary-ink hover:underline">
          {r.orderId}
        </Link>

  },
  { key: 'customer', header: 'Customer', render: (r) => orderOf(r) ? getCustomer(orderOf(r)!.customerId)?.name : '—' },
  { key: 'patient', header: 'Patient', render: (r) => orderOf(r) ? getPatient(orderOf(r)!.patientId)?.name : '—' },
  {
    key: 'reason',
    header: c.reasonHeader,
    className: 'max-w-[260px]',
    render: (r) => <PersonCell name={r.reason} secondary={r.details} />
  },
  { key: 'by', header: 'Referred By', sortKey: 'by', render: (r) => r.referredBy },
  { key: 'date', header: 'Referral Date', sortKey: 'createdAt', render: (r) => <span className="whitespace-nowrap">{fmt.dateTime(r.createdAt)}</span> },
  { key: 'status', header: 'Status', sortKey: 'status', render: (r) => <StatusBadge status={r.status} label={r.status === 'Returned for Pharmacist Review' ? 'Returned to Pharmacist' : undefined} /> },
  { key: 'view', header: 'View Details', align: 'right', render: (r) => <ViewLink to={referralPath(r)} srLabel={r.id} /> }];


  return (
    <div>
      <PageHeader title={c.title} count={list.length} description={`${c.description} ${openCount} open.`} />
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search referral, order, customer or reason" label={`Search ${c.title.toLowerCase()}`} />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}>
        
        <FilterSelect label="Status" value={table.getFilter('status')} onChange={(v) => table.setFilter('status', v)} options={c.statusOptions} />
        <FilterSelect
          label="Reason"
          value={table.getFilter('reason')}
          onChange={(v) => table.setFilter('reason', v)}
          options={[{ value: 'all', label: 'All' }, ...c.reasons.map((r) => ({ value: r, label: r }))]} />
        
        <DateRangeFilter value={table.dateRange} onChange={table.setDateRange} label="Referred" />
      </ListToolbar>
      <DataTable
        caption={c.title}
        columns={columns}
        rows={table.pageItems}
        rowKey={(r) => r.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(r) => navigate(referralPath(r))}
        minWidth="min-w-[1160px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState icon={SearchXIcon} title="No matching referrals" message="Try different filters or clear them." action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :

        <EmptyState icon={c.icon} title={c.empty} message="Referrals appear here when an order is routed for clarification." />

        }
        mobileCard={(r) =>
        <MobileRecordCard
          to={referralPath(r)}
          title={r.id}
          subtitle={r.reason}
          badge={<StatusBadge status={r.status} />}
          fields={[
          { label: 'Order', value: r.orderId },
          { label: 'Patient', value: orderOf(r) ? getPatient(orderOf(r)!.patientId)?.name : '—' },
          { label: 'Referred by', value: r.referredBy },
          { label: 'Date', value: fmt.date(r.createdAt) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}