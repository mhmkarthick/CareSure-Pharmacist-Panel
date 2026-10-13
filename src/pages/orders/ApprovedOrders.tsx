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
import { ViewLink } from '../../components/ui/ViewLink';
import { MobileRecordCard } from '../../components/ui/MobileRecordCard';
import { fulfilmentOptions, orderTypeOptions } from '../../data/filterOptions';
import { getCustomer, getPatient } from '../../utils/lookups';
import { computeBill } from '../../utils/billing';
import type { Order } from '../../types/order';

export function ApprovedOrders() {
  const { orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();
  const approved = isEmptyForced ? [] : orders.filter((o) => o.status === 'Approved');
  const detailPath = (o: Order) => `/orders/approved/${o.id}`;

  const table = useTableState<Order>({
    data: approved,
    search: (o) => `${o.id} ${getCustomer(o.customerId)?.name} ${getPatient(o.patientId)?.name} ${o.approval?.by}`,
    filters: [
    { key: 'type', match: (o, v) => o.type === v },
    { key: 'fulfilment', match: (o, v) => o.fulfilment === v }],

    dateOf: (o) => o.approval?.at ?? o.placedAt,
    sorters: {
      id: (o) => o.id,
      customer: (o) => getCustomer(o.customerId)?.name ?? '',
      placedAt: (o) => o.placedAt,
      approvedAt: (o) => o.approval?.at ?? '',
      by: (o) => o.approval?.by ?? '',
      total: (o) => computeBill(o).total,
      fulfilment: (o) => o.fulfilment ?? ''
    },
    initialSort: { key: 'approvedAt', direction: 'desc' }
  });

  const columns: Column<Order>[] = [
  { key: 'id', header: 'Order ID', sortKey: 'id', render: (o) => <span className="font-semibold tabular-nums">{o.id}</span> },
  { key: 'customer', header: 'Customer', sortKey: 'customer', render: (o) => getCustomer(o.customerId)?.name },
  { key: 'patient', header: 'Patient', render: (o) => getPatient(o.patientId)?.name },
  { key: 'type', header: 'Order Type', render: (o) => <OrderTypeBadge type={o.type} /> },
  { key: 'date', header: 'Order Date', sortKey: 'placedAt', render: (o) => <span className="whitespace-nowrap">{fmt.date(o.placedAt)}</span> },
  { key: 'approvedAt', header: 'Approval Date', sortKey: 'approvedAt', render: (o) => <span className="whitespace-nowrap">{o.approval ? fmt.dateTime(o.approval.at) : '—'}</span> },
  { key: 'by', header: 'Approved By', sortKey: 'by', render: (o) => o.approval?.by ?? '—' },
  { key: 'total', header: 'Total Amount', sortKey: 'total', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'fulfilment', header: 'Fulfilment', sortKey: 'fulfilment', render: (o) => o.fulfilment ? <StatusBadge status={o.fulfilment} /> : '—' },
  { key: 'view', header: 'View Details', align: 'right', render: (o) => <ViewLink to={detailPath(o)} srLabel={o.id} /> }];


  return (
    <div>
      <PageHeader title="Approved Orders" count={approved.length} description="Orders verified by a pharmacist and released to fulfilment." />
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search order, customer, patient or pharmacist" label="Search approved orders" />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}>
        
        <FilterSelect label="Type" value={table.getFilter('type')} onChange={(v) => table.setFilter('type', v)} options={orderTypeOptions} />
        <FilterSelect label="Fulfilment" value={table.getFilter('fulfilment')} onChange={(v) => table.setFilter('fulfilment', v)} options={fulfilmentOptions} />
        <DateRangeFilter value={table.dateRange} onChange={table.setDateRange} label="Approved" />
      </ListToolbar>
      <DataTable
        caption="Approved orders"
        columns={columns}
        rows={table.pageItems}
        rowKey={(o) => o.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(o) => navigate(detailPath(o))}
        minWidth="min-w-[1140px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState icon={SearchXIcon} title="No matching orders" message="No approved orders match these filters." action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :

        <EmptyState icon={CircleCheckIcon} title="No approved orders" message="Orders you verify and approve will appear here." />

        }
        mobileCard={(o) =>
        <MobileRecordCard
          to={detailPath(o)}
          title={o.id}
          subtitle={`${getCustomer(o.customerId)?.name} → ${getPatient(o.patientId)?.name}`}
          badge={o.fulfilment && <StatusBadge status={o.fulfilment} />}
          fields={[
          { label: 'Approved', value: o.approval ? fmt.date(o.approval.at) : '—' },
          { label: 'By', value: o.approval?.by ?? '—' },
          { label: 'Type', value: o.type },
          { label: 'Total', value: fmt.money(computeBill(o).total) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}