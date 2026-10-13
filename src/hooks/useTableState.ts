import { useEffect, useState } from 'react';
import { useAppState } from '../contexts/AppStateContext';
import type { DateRange } from '../types/table';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface FilterDefinition<T> {
  key: string;
  match: (item: T, value: string) => boolean;
}

interface TableOptions<T> {
  data: T[];
  search?: (item: T) => string;
  filters?: FilterDefinition<T>[];
  sorters: Record<string, (item: T) => string | number>;
  initialSort: SortState;
  dateOf?: (item: T) => string;
}

/** Client-side search, filtering, sorting and pagination for list screens. */
export function useTableState<T>({ data, search, filters = [], sorters, initialSort, dateOf }: TableOptions<T>) {
  const { preferences } = useAppState();
  const pageSize = preferences.tableRows;
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' });
  const [sort, setSort] = useState<SortState>(initialSort);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, filterValues, dateRange, pageSize]);

  const q = query.trim().toLowerCase();
  const filtered = data.filter((item) => {
    if (q && search && !search(item).toLowerCase().includes(q)) return false;
    for (const f of filters) {
      const v = filterValues[f.key];
      if (v && v !== 'all' && !f.match(item, v)) return false;
    }
    if (dateOf && (dateRange.from || dateRange.to)) {
      const d = dateOf(item).slice(0, 10);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }
    return true;
  });

  const getter = sorters[sort.key];
  const sorted = getter ?
  [...filtered].sort((a, b) => {
    const av = getter(a);
    const bv = getter(b);
    const c =
    typeof av === 'number' && typeof bv === 'number' ?
    av - bv :
    String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sort.direction === 'asc' ? c : -c;
  }) :
  filtered;

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasActiveFilters =
  Boolean(q) || Object.values(filterValues).some((v) => v && v !== 'all') || Boolean(dateRange.from || dateRange.to);

  return {
    query,
    setQuery,
    getFilter: (key: string) => filterValues[key] ?? 'all',
    setFilter: (key: string, value: string) => setFilterValues((prev) => ({ ...prev, [key]: value })),
    dateRange,
    setDateRange,
    sort,
    toggleSort: (key: string) =>
    setSort((prev) =>
    prev.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }
    ),
    page: currentPage,
    setPage,
    pageCount,
    pageSize,
    pageItems,
    filteredCount: sorted.length,
    total: data.length,
    hasActiveFilters,
    clearAll: () => {
      setQuery('');
      setFilterValues({});
      setDateRange({ from: '', to: '' });
    }
  };
}