import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxIcon, SearchXIcon, SlidersHorizontalIcon } from 'lucide-react';
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
import { amountBandOptions, orderStatusOptions, orderTypeOptions } from '../../data/filterOptions';
import { customers } from '../../data/customers';
import { patients } from '../../data/patients';
import { getCustomer, getPatient } from '../../utils/lookups';
import { amountBand, computeBill } from '../../utils/billing';
import { orderPath } from '../../utils/workflow';
import type { Order } from '../../types/order';

export function AllOrders() {
  const { orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();
  const [showMore, setShowMore] = useState(false);

  const table = useTableState<Order>({
    data: isEmptyForced ? [] : orders,
    search: (o) => `${o.id} ${getCustomer(o.customerId)?.name} ${getCustomer(o.customerId)?.phone} ${getPatient(o.patientId)?.name}`,
    filters: [
    { key: 'status', match: (o, v) => o.status === v },
    { key: 'type', match: (o, v) => o.type === v },
    { key: 'customer', match: (o, v) => o.customerId === v },
    { key: 'patient', match: (o, v) => o.patientId === v },
    { key: 'amount', match: (o, v) => amountBand(computeBill(o).total) === v }],

    dateOf: (o) => o.placedAt,
    sorters: {
      id: (o) => o.id,
      customer: (o) => getCustomer(o.customerId)?.name ?? '',
      patient: (o) => getPatient(o.patientId)?.name ?? '',
      type: (o) => o.type,
      placedAt: (o) => o.placedAt,
      total: (o) => computeBill(o).total,
      status: (o) => o.status,
      updatedAt: (o) => o.updatedAt
    },
    initialSort: { key: 'placedAt', direction: 'desc' }
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
  { key: 'date', header: 'Order Date', sortKey: 'placedAt', render: (o) => <span className="whitespace-nowrap">{fmt.date(o.placedAt)}</span> },
  { key: 'total', header: 'Total Amount', sortKey: 'total', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'status', header: 'Status', sortKey: 'status', render: (o) => <StatusBadge status={o.status} /> },
  { key: 'updated', header: 'Last Updated', sortKey: 'updatedAt', render: (o) => <span className="whitespace-nowrap text-muted">{fmt.dateTime(o.updatedAt)}</span> },
  { key: 'actions', header: 'Actions', align: 'right', render: (o) => <ViewLink to={orderPath(o)} srLabel={o.id} /> }];


  return (
    <div>
      <PageHeader
        title="All Orders"
        count={isEmptyForced ? 0 : orders.length}
        description="Every order across OTC, Upload Prescription and Add Rx workflows." />
      
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search order ID, customer or patient" label="Search orders" />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}
        extra={
        showMore &&
        <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
            label="Customer"
            value={table.getFilter('customer')}
            onChange={(v) => table.setFilter('customer', v)}
            options={[{ value: 'all', label: 'All' }, ...customers.map((c) => ({ value: c.id, label: c.name }))]} />
          
              <FilterSelect
            label="Patient"
            value={table.getFilter('patient')}
            onChange={(v) => table.setFilter('patient', v)}
            options={[{ value: 'all', label: 'All' }, ...patients.map((p) => ({ value: p.id, label: p.name }))]} />
          
              <FilterSelect label="Amount" value={table.getFilter('amount')} onChange={(v) => table.setFilter('amount', v)} options={amountBandOptions} />
            </div>

        }>
        
        <FilterSelect label="Status" value={table.getFilter('status')} onChange={(v) => table.setFilter('status', v)} options={orderStatusOptions} />
        <FilterSelect label="Type" value={table.getFilter('type')} onChange={(v) => table.setFilter('type', v)} options={orderTypeOptions} />
        <DateRangeFilter value={table.dateRange} onChange={table.setDateRange} label="Ordered" />
        <Button size="md" variant={showMore ? 'secondary' : 'ghost'} icon={SlidersHorizontalIcon} onClick={() => setShowMore((s) => !s)} aria-expanded={showMore}>
          {showMore ? 'Fewer filters' : 'More filters'}
        </Button>
      </ListToolbar>
      <DataTable
        caption="All orders"
        columns={columns}
        rows={table.pageItems}
        rowKey={(o) => o.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(o) => navigate(orderPath(o))}
        minWidth="min-w-[1080px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState
          icon={SearchXIcon}
          title="No matching orders"
          message="Try a different search term or clear the filters."
          action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :


        <EmptyState icon={InboxIcon} title="No orders yet" message="Orders placed by customers will appear here." />

        }
        mobileCard={(o) =>
        <MobileRecordCard
          to={orderPath(o)}
          title={o.id}
          subtitle={`${getCustomer(o.customerId)?.name} → ${getPatient(o.patientId)?.name}`}
          badge={<StatusBadge status={o.status} />}
          fields={[
          { label: 'Type', value: o.type },
          { label: 'Order date', value: fmt.date(o.placedAt) },
          { label: 'Total', value: fmt.money(computeBill(o).total) },
          { label: 'Updated', value: fmt.date(o.updatedAt) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}