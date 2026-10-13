import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleXIcon, SearchXIcon } from 'lucide-react';
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
import { ViewLink } from '../../components/ui/ViewLink';
import { MobileRecordCard } from '../../components/ui/MobileRecordCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { orderTypeOptions } from '../../data/filterOptions';
import { rejectionReasons } from '../../data/workflowReasons';
import { getCustomer, getPatient } from '../../utils/lookups';
import { computeBill } from '../../utils/billing';
import type { Order } from '../../types/order';

export function RejectedOrders() {
  const { orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();
  const rejected = isEmptyForced ? [] : orders.filter((o) => o.status === 'Rejected');
  const detailPath = (o: Order) => `/orders/rejected/${o.id}`;

  const table = useTableState<Order>({
    data: rejected,
    search: (o) => `${o.id} ${getCustomer(o.customerId)?.name} ${getPatient(o.patientId)?.name} ${o.rejection?.reason}`,
    filters: [
    { key: 'type', match: (o, v) => o.type === v },
    { key: 'reason', match: (o, v) => o.rejection?.reason === v }],

    dateOf: (o) => o.rejection?.at ?? o.placedAt,
    sorters: {
      id: (o) => o.id,
      customer: (o) => getCustomer(o.customerId)?.name ?? '',
      placedAt: (o) => o.placedAt,
      rejectedAt: (o) => o.rejection?.at ?? '',
      by: (o) => o.rejection?.by ?? '',
      total: (o) => computeBill(o).total
    },
    initialSort: { key: 'rejectedAt', direction: 'desc' }
  });

  const columns: Column<Order>[] = [
  { key: 'id', header: 'Order ID', sortKey: 'id', render: (o) => <span className="font-semibold tabular-nums">{o.id}</span> },
  { key: 'customer', header: 'Customer', sortKey: 'customer', render: (o) => getCustomer(o.customerId)?.name },
  { key: 'patient', header: 'Patient', render: (o) => getPatient(o.patientId)?.name },
  { key: 'date', header: 'Order Date', sortKey: 'placedAt', render: (o) => <span className="whitespace-nowrap">{fmt.date(o.placedAt)}</span> },
  { key: 'rejectedAt', header: 'Rejection Date', sortKey: 'rejectedAt', render: (o) => <span className="whitespace-nowrap">{o.rejection ? fmt.dateTime(o.rejection.at) : '—'}</span> },
  { key: 'by', header: 'Rejected By', sortKey: 'by', render: (o) => o.rejection?.by ?? '—' },
  {
    key: 'reason',
    header: 'Rejection Reason',
    className: 'max-w-[260px]',
    render: (o) =>
    <div className="min-w-0">
          <StatusBadge status="Rejected" label={o.rejection?.reason ?? 'Rejected'} className="max-w-full" />
          {o.rejection?.details &&
      <p className="mt-1 truncate text-[11.5px] text-muted" title={o.rejection.details}>
              {o.rejection.details}
            </p>
      }
        </div>

  },
  { key: 'total', header: 'Total Amount', sortKey: 'total', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'view', header: 'View Details', align: 'right', render: (o) => <ViewLink to={detailPath(o)} srLabel={o.id} /> }];


  return (
    <div>
      <PageHeader title="Rejected Orders" count={rejected.length} description="Orders declined at pharmacist review, with the recorded reason." />
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search order, customer, patient or reason" label="Search rejected orders" />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}>
        
        <FilterSelect label="Type" value={table.getFilter('type')} onChange={(v) => table.setFilter('type', v)} options={orderTypeOptions} />
        <FilterSelect
          label="Reason"
          value={table.getFilter('reason')}
          onChange={(v) => table.setFilter('reason', v)}
          options={[{ value: 'all', label: 'All' }, ...rejectionReasons.map((r) => ({ value: r, label: r }))]} />
        
        <DateRangeFilter value={table.dateRange} onChange={table.setDateRange} label="Rejected" />
      </ListToolbar>
      <DataTable
        caption="Rejected orders"
        columns={columns}
        rows={table.pageItems}
        rowKey={(o) => o.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(o) => navigate(detailPath(o))}
        minWidth="min-w-[1120px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState icon={SearchXIcon} title="No matching orders" message="No rejected orders match these filters." action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :

        <EmptyState icon={CircleXIcon} title="No rejected orders" message="Orders rejected during pharmacist review will appear here." />

        }
        mobileCard={(o) =>
        <MobileRecordCard
          to={detailPath(o)}
          title={o.id}
          subtitle={o.rejection?.reason}
          badge={<StatusBadge status="Rejected" />}
          fields={[
          { label: 'Customer', value: getCustomer(o.customerId)?.name },
          { label: 'Rejected', value: o.rejection ? fmt.date(o.rejection.at) : '—' },
          { label: 'By', value: o.rejection?.by ?? '—' },
          { label: 'Total', value: fmt.money(computeBill(o).total) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}