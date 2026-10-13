import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxIcon, SearchXIcon } from 'lucide-react';
import type { Order } from '../../types/order';
import type { DataStatus } from '../../types/table';
import { useFormatters } from '../../hooks/useFormatters';
import { useTableState } from '../../hooks/useTableState';
import { DataTable, type Column } from '../ui/DataTable';
import { Pagination } from '../ui/Pagination';
import { FilterSelect } from '../ui/FilterSelect';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { OrderTypeBadge } from '../ui/OrderTypeBadge';
import { ViewLink } from '../ui/ViewLink';
import { MobileRecordCard } from '../ui/MobileRecordCard';
import { orderStatusOptions, orderTypeOptions } from '../../data/filterOptions';
import { getPatient } from '../../utils/lookups';
import { computeBill } from '../../utils/billing';
import { orderPath } from '../../utils/workflow';

interface CustomerOrderHistoryProps {
  orders: Order[];
  status: DataStatus;
  onRetry: () => void;
}

export function CustomerOrderHistory({ orders, status, onRetry }: CustomerOrderHistoryProps) {
  const fmt = useFormatters();
  const navigate = useNavigate();
  const table = useTableState<Order>({
    data: orders,
    filters: [
    { key: 'status', match: (o, v) => o.status === v },
    { key: 'type', match: (o, v) => o.type === v }],

    sorters: { id: (o) => o.id, placedAt: (o) => o.placedAt, total: (o) => computeBill(o).total },
    initialSort: { key: 'placedAt', direction: 'desc' }
  });

  const columns: Column<Order>[] = [
  { key: 'id', header: 'Order ID', sortKey: 'id', render: (o) => <span className="font-semibold tabular-nums">{o.id}</span> },
  { key: 'date', header: 'Order Date', sortKey: 'placedAt', render: (o) => <span className="whitespace-nowrap">{fmt.date(o.placedAt)}</span> },
  { key: 'patient', header: 'Patient', render: (o) => getPatient(o.patientId)?.name },
  { key: 'type', header: 'Order Type', render: (o) => <OrderTypeBadge type={o.type} /> },
  { key: 'amount', header: 'Amount', sortKey: 'total', align: 'right', render: (o) => <span className="tabular-nums">{fmt.money(computeBill(o).total)}</span> },
  { key: 'status', header: 'Order Status', render: (o) => <StatusBadge status={o.status} /> },
  { key: 'view', header: 'View Order', align: 'right', render: (o) => <ViewLink to={orderPath(o)} srLabel={o.id} /> }];


  return (
    <section aria-labelledby="order-history-title">
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="order-history-title" className="text-[15px] font-semibold text-ink">
          Order History <span className="font-normal text-muted">({orders.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <FilterSelect label="Status" value={table.getFilter('status')} onChange={(v) => table.setFilter('status', v)} options={orderStatusOptions} />
          <FilterSelect label="Type" value={table.getFilter('type')} onChange={(v) => table.setFilter('type', v)} options={orderTypeOptions} />
        </div>
      </div>
      <DataTable
        caption="Customer order history"
        columns={columns}
        rows={table.pageItems}
        rowKey={(o) => o.id}
        status={status}
        onRetry={onRetry}
        sort={table.sort}
        onSort={table.toggleSort}
        onRowClick={(o) => navigate(orderPath(o))}
        minWidth="min-w-[720px]"
        empty={
        table.hasActiveFilters ?
        <EmptyState compact icon={SearchXIcon} title="No matching orders" action={<Button size="sm" onClick={table.clearAll}>Clear filters</Button>} /> :

        <EmptyState compact icon={InboxIcon} title="No order history" message="This customer hasn't placed any orders yet." />

        }
        mobileCard={(o) =>
        <MobileRecordCard
          to={orderPath(o)}
          title={o.id}
          subtitle={`${getPatient(o.patientId)?.name} · ${o.type}`}
          badge={<StatusBadge status={o.status} />}
          fields={[
          { label: 'Date', value: fmt.date(o.placedAt) },
          { label: 'Amount', value: fmt.money(computeBill(o).total) }]
          } />

        }
        footer={<Pagination page={table.page} pageCount={table.pageCount} pageSize={table.pageSize} total={table.filteredCount} onPageChange={table.setPage} />} />
      
    </section>);

}