'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

import { useGetClients } from '@/hooks/requestHooks/useGetClients';
import type { Client } from '@/types/types/ClientTypes';

export function useClientsTable() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [searchInput]);

  const { query, error, refetchClients } = useGetClients(debouncedSearch);

  const clients: Client[] =
    query.data?.success === true ? ((query.data.data ?? []) as Client[]) : [];

  const errorText = error?.message || '';

  const columns = useMemo<ColumnDef<Client>[]>(() => {
    return [
      {
        header: 'Імʼя',
        accessorKey: 'fullName',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Нотатки',
        accessorKey: 'notes',
        cell: info => String(info.getValue() ?? '—'),
      },
    ];
  }, []);

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const refresh = () => refetchClients();

  const clearSearch = () => setSearchInput('');

  const createClient = () => router.push('/clients/new');

  const openClient = (clientId: string) => {
    if (!clientId) return;
    router.push(`/clients/${clientId}`);
  };

  return {
    table,
    query,
    errorText,
    searchInput,
    setSearchInput,
    refresh,
    clearSearch,
    createClient,
    openClient,
  };
}
