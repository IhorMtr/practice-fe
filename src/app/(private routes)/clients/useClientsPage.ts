'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

import { useGetClients } from '@/hooks/requestHooks/useGetClients';
import type { Client } from '@/types/types/ClientTypes';

export function useClientsPage() {
  const router = useRouter();

  // =============== SEARCH STATE =============
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const t = setTimeout(() => {
      const v = searchInput.trim();
      setDebouncedSearch(v);
    }, 350);

    return () => clearTimeout(t);
  }, [searchInput]);

  // =============== QUERY =============
  const { query, error, refetchClients } = useGetClients(debouncedSearch);

  const clients: Client[] = useMemo(() => {
    const payload = query.data;
    if (!payload || payload.success !== true) return [];
    return (payload.data ?? []) as Client[];
  }, [query.data]);

  const errorText = useMemo(() => {
    return error?.message || '';
  }, [error?.message]);

  // =============== TABLE =============
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

  // =============== ACTIONS =============
  const onRefresh = useCallback(() => {
    refetchClients();
  }, [refetchClients]);

  const onClearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  const onCreate = useCallback(() => {
    router.push('/clients/new');
  }, [router]);

  return {
    table,
    query,
    errorText,
    searchInput,
    setSearchInput,
    onClearSearch,
    onRefresh,
    onCreate,
  };
}
