'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

import { useGetTickets } from '@/hooks/requestHooks/useGetTickets';
import type { Ticket } from '@/types/types/TicketTypes';

export function useTicketsTable() {
  const router = useRouter();

  // =============== SEARCH STATE =============

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [searchInput]);

  // =============== QUERY =============

  const { query, error, refetchTickets } = useGetTickets({
    search: debouncedSearch,
  });

  // =============== DERIVED DATA =============

  const tickets: Ticket[] =
    query.data?.success === true ? ((query.data.data ?? []) as Ticket[]) : [];

  const errorText = error?.message || '';

  // =============== TABLE =============

  const columns = useMemo<ColumnDef<Ticket>[]>(() => {
    return [
      {
        header: 'Пристрій',
        accessorKey: 'deviceType',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Пріоритет',
        accessorKey: 'priority',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Створено',
        accessorKey: 'createdAt',
        cell: info => String(info.getValue() ?? '—'),
      },
    ];
  }, []);

  const table = useReactTable({
    data: tickets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // =============== ACTIONS =============

  const refresh = () => refetchTickets();

  const clearSearch = () => setSearchInput('');

  const createTicket = () => router.push('/tickets/new');

  const openTicket = (ticketId: string) => {
    if (!ticketId) return;
    router.push(`/tickets/${ticketId}`);
  };

  // =============== API =============

  return {
    table,
    query,
    errorText,
    searchInput,
    setSearchInput,
    refresh,
    clearSearch,
    createTicket,
    openTicket,
  };
}
