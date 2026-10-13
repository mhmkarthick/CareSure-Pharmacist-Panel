import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheckIcon, SearchXIcon } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext';
import { useFormatters } from '../../hooks/useFormatters';
import { useDataStatus } from '../../hooks/useDataStatus';
import { useTableState } from '../../hooks/useTableState';
import { PageHeader } from '../../components/ui/PageHeader';
import { ListToolbar } from '../../components/ui/ListToolbar';
import { SearchField } from '../../components/ui/SearchField';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DateRangeFilter } from '../../components/ui/DateRangeFilter';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { OrderTypeBadge } from '../../components/ui/OrderTypeBadge';
import { PersonCell } from '../../components/ui/PersonCell';
import { ViewLink } from '../../components/ui/ViewLink';
import { MobileRecordCard } from '../../components/ui/MobileRecordCard';
import { RxAvailabilityBadge } from '../../components/order/RxAvailabilityBadge';
import { orderTypeOptions, rxAvailabilityOptions } from '../../data/filterOptions';
import { getCustomer, getPatient } from '../../utils/lookups';
import { computeBill } from '../../utils/billing';
import { rxAvailability } from '../../utils/clinical';
import type { Order } from '../../types/order';

export function PendingApproval() {
  const { orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();
  const pending = isEmptyForced ? [] : orders.filter((o) => o.status === 'Pending Approval');
  const detailPath = (o: Order) => `/orders/pending-approval/${o.id}`;

  const table = useTableState<Order>({
    data: pending,
    search: (o) => `${o.id} ${getCustomer(o.customerId)?.name} ${getPatient(o.patientId)?.name}`,
    filters: [
    { key: 'type', match: (o, v) => o.type === v },
    { key: 'rx', match: (o, v) => rxAvailability(o) === v }],

    dateOf: (o) => o.placedAt,
    sorters: {
      id: (o) => o.id,
      customer: (o) => getCustomer(o.customerId)?.name ?? '',
      patient: (o) => getPatient(o.patientId)?.name ?? '',
      type: (o) => o.type,
      placedAt: (o) => o.placedAt,
      total: (o) => computeBill(o).total
    },
    initialSort: { key: 'placedAt', direction: 'asc' }
  });

  const columns: Column<Order>[] = [
  { key: 'id', header: 'Order ID', sortKey: 'id', render: (o) => <span className="font-semibold tabular-nums">{o.id}</span> },
  {
    key: 'customer',
    header: 'Order Placed By',
    sortKey: 'customer',
    render: (o) => <PersonCell name={getCustomer(o.customerId)?.name ?? '—'} secondary={getCustomer(o.customerId)?.phone} />
  },
  { key: 'patient', header: 'Patient', sortKey: 'patient', render: (o) => getPatient(o.patientId)?.name },
  { key: 'type', header: 'Order Type', sortKey: 'type', render: (o) => <OrderTypeBadge type={o.type} /> },
  {
    key: 'date',
    header: 'Order Date',
    sortKey: 'placedAt',
    render: (o) => <PersonCell name={fmt.date(o.placedAt)} secondary={fmt.time(o.placedAt)} />
  },
  { key: 'rx', header: 'Prescription', render: (o) => <RxAvailabilityBadge order={o} /> },
  { key: 'total', header: 'Total Amount', sortKey: 'total', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  { key: 'view', header: 'View Details', align: 'right', render: (o) => <ViewLink to={detailPath(o)} label="Review" srLabel={o.id} /> }];


  return (
    <div>
      <PageHeader
        title="Pending Approval"
        count={pending.length}
        description="Orders that have cleared earlier workflow stages and are waiting for your verification. Oldest first." />
      
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search order ID, customer or patient" label="Search pending orders" />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}>
        
        <FilterSelect label="Type" value={table.getFilter('type')} onChange={(v) => table.setFilter('type', v)} options={orderTypeOptions} />
        <FilterSelect label="Prescription" value={table.getFilter('rx')} onChange={(v) => table.setFilter('rx', v)} options={rxAvailabilityOptions} />
        <DateRangeFilter value={table.dateRange} onChange={table.setDateRange} label="Ordered" />
      </ListToolbar>
      <DataTable
        caption="Orders pending approval"
        columns={columns}
        rows={table.pageItems}
        rowKey={(o) => o.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(o) => navigate(detailPath(o))}
        minWidth="min-w-[1020px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState
          icon={SearchXIcon}
          title="No matching orders"
          message="No pending orders match these filters."
          action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :


        <EmptyState icon={CircleCheckIcon} title="No pending orders" message="You're all caught up. New orders appear here once they clear caller and doctor review." />

        }
        mobileCard={(o) =>
        <MobileRecordCard
          to={detailPath(o)}
          title={o.id}
          subtitle={`${getPatient(o.patientId)?.name} · ${o.type}`}
          badge={<RxAvailabilityBadge order={o} />}
          fields={[
          { label: 'Placed by', value: getCustomer(o.customerId)?.name },
          { label: 'Order date', value: fmt.dateTime(o.placedAt) },
          { label: 'Total', value: fmt.money(computeBill(o).total) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}