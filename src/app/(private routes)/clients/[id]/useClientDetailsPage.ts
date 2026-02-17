'use client';

import { useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useGetClientById } from '@/hooks/requestHooks/useGetClientById';
import type { Client } from '@/types/types/ClientTypes';

export function useClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? '');

  const { query, error } = useGetClientById(id);

  // =============== DERIVED DATA =============
  const client = useMemo<Client | null>(() => {
    const payload = query.data;
    if (!payload || payload.success !== true) return null;
    return (payload.data ?? null) as Client | null;
  }, [query.data]);

  const errorText = useMemo(() => error?.message || '', [error?.message]);

  // =============== ACTIONS =============
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onEdit = useCallback(() => {
    router.push(`/clients/${id}/edit`);
  }, [id, router]);

  return {
    id,
    query,
    client,
    errorText,
    onBack,
    onEdit,
  };
}
