import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchXIcon, UsersIcon } from 'lucide-react';
import { useAppState } from '../contexts/AppStateContext';
import { useFormatters } from '../hooks/useFormatters';
import { useDataStatus } from '../hooks/useDataStatus';
import { useTableState } from '../hooks/useTableState';
import { PageHeader } from '../components/ui/PageHeader';
import { ListToolbar } from '../components/ui/ListToolbar';
import { SearchField } from '../components/ui/SearchField';
import { FilterSelect } from '../components/ui/FilterSelect';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ViewLink } from '../components/ui/ViewLink';
import { MobileRecordCard } from '../components/ui/MobileRecordCard';
import { PersonCell } from '../components/ui/PersonCell';
import { customers } from '../data/customers';
import { customerStatusOptions } from '../data/filterOptions';
import type { Customer } from '../types/customer';
import type { Order } from '../types/order';

interface CustomerRow {
  customer: Customer;
  totalOrders: number;
  lastOrder?: Order;
}

export function Customers() {
  const { orders } = useAppState();
  const fmt = useFormatters();
  const navigate = useNavigate();
  const { status, isEmptyForced, retry } = useDataStatus();

  const rows = useMemo<CustomerRow[]>(
    () =>
    customers.map((customer) => {
      const own = orders.filter((o) => o.customerId === customer.id).sort((a, b) => b.placedAt.localeCompare(a.placedAt));
      return { customer, totalOrders: own.length, lastOrder: own[0] };
    }),
    [orders]
  );

  const cities = Array.from(new Set(customers.map((c) => c.city))).sort();

  const table = useTableState<CustomerRow>({
    data: isEmptyForced ? [] : rows,
    search: (r) => `${r.customer.id} ${r.customer.name} ${r.customer.phone} ${r.customer.email ?? ''}`,
    filters: [
    { key: 'status', match: (r, v) => r.customer.status === v },
    { key: 'city', match: (r, v) => r.customer.city === v }],

    sorters: {
      id: (r) => r.customer.id,
      name: (r) => r.customer.name,
      orders: (r) => r.totalOrders,
      last: (r) => r.lastOrder?.placedAt ?? ''
    },
    initialSort: { key: 'last', direction: 'desc' }
  });

  const detailPath = (r: CustomerRow) => `/customers/${r.customer.id}`;

  const columns: Column<CustomerRow>[] = [
  { key: 'id', header: 'Customer ID', sortKey: 'id', render: (r) => <span className="font-semibold tabular-nums">{r.customer.id}</span> },
  { key: 'name', header: 'Customer Name', sortKey: 'name', render: (r) => <PersonCell name={r.customer.name} secondary={r.customer.city} /> },
  { key: 'phone', header: 'Phone Number', render: (r) => <span className="whitespace-nowrap tabular-nums">{r.customer.phone}</span> },
  { key: 'email', header: 'Email', render: (r) => r.customer.email ?? <span className="text-muted">Not provided</span> },
  { key: 'orders', header: 'Total Orders', sortKey: 'orders', align: 'right', render: (r) => <span className="tabular-nums">{r.totalOrders}</span> },
  {
    key: 'last',
    header: 'Most Recent Order',
    sortKey: 'last',
    render: (r) => r.lastOrder ? <PersonCell name={r.lastOrder.id} secondary={fmt.date(r.lastOrder.placedAt)} /> : <span className="text-muted">No orders</span>
  },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.customer.status} /> },
  { key: 'view', header: 'View Details', align: 'right', render: (r) => <ViewLink to={detailPath(r)} srLabel={r.customer.name} /> }];


  return (
    <div>
      <PageHeader title="Customers" count={isEmptyForced ? 0 : customers.length} description="Customers who have placed orders, with their order history and linked patients." />
      <ListToolbar
        search={<SearchField value={table.query} onChange={table.setQuery} placeholder="Search name, phone or customer ID" label="Search customers" />}
        hasActiveFilters={table.hasActiveFilters}
        onClear={table.clearAll}
        resultCount={table.filteredCount}
        total={table.total}>
        
        <FilterSelect label="Status" value={table.getFilter('status')} onChange={(v) => table.setFilter('status', v)} options={customerStatusOptions} />
        <FilterSelect
          label="City"
          value={table.getFilter('city')}
          onChange={(v) => table.setFilter('city', v)}
          options={[{ value: 'all', label: 'All' }, ...cities.map((c) => ({ value: c, label: c }))]} />
        
      </ListToolbar>
      <DataTable
        caption="Customers"
        columns={columns}
        rows={table.pageItems}
        rowKey={(r) => r.customer.id}
        status={status}
        onRetry={retry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(r) => navigate(detailPath(r))}
        minWidth="min-w-[1000px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState icon={SearchXIcon} title="No customers found" message="No customers match your search or filters." action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :

        <EmptyState icon={UsersIcon} title="No customers yet" message="Customers appear here after their first order." />

        }
        mobileCard={(r) =>
        <MobileRecordCard
          to={detailPath(r)}
          title={r.customer.name}
          subtitle={`${r.customer.id} · ${r.customer.phone}`}
          badge={<StatusBadge status={r.customer.status} />}
          fields={[
          { label: 'Total orders', value: r.totalOrders },
          { label: 'Last order', value: r.lastOrder ? fmt.date(r.lastOrder.placedAt) : '—' }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </div>);

}