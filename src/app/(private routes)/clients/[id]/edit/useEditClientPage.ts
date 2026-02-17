'use client';

import { useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useGetClientById } from '@/hooks/requestHooks/useGetClientById';
import { useUpdateClient } from '@/hooks/requestHooks/useUpdateClient';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import { ClientEditFormValues } from '@/types/types/ClientTypes';

// =============== TYPES =============

export function useEditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = String(params?.id ?? '');

  const queryClient = useQueryClient();

  // =============== QUERIES =============
  const { query, error } = useGetClientById(clientId);
  const { query: updateQuery, updateClient } = useUpdateClient();

  // =============== DERIVED DATA =============
  const client = useMemo(() => {
    const payload = query.data;
    if (!payload || payload.success !== true) return null;
    return payload.data ?? null;
  }, [query.data]);

  const errorText = useMemo(() => error?.message || '', [error?.message]);

  const initialValues = useMemo<ClientEditFormValues>(() => {
    return {
      fullName: client?.fullName ?? '',
      email: client?.email ?? '',
      notes: client?.notes ?? '',
    };
  }, [client?.email, client?.fullName, client?.notes]);

  // =============== ACTIONS =============
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onCancel = useCallback(() => {
    router.replace(`/clients/${clientId}`);
  }, [clientId, router]);

  const onSubmit = useCallback(
    async (values: ClientEditFormValues) => {
      const fullName = values.fullName.trim();
      const email = values.email.trim().toLowerCase();
      const notes = values.notes.trim();

      const payload = await updateClient({
        clientId,
        fullName,
        email,
        notes: notes ? notes : null,
      });

      if (ApiConfigService.isSuccess(payload)) {
        await queryClient.refetchQueries({ queryKey: ['clients'] });
        await queryClient.refetchQueries({ queryKey: ['client', clientId] });

        toast.success('Дані клієнта оновлено.');
        router.replace(`/clients/${clientId}`);
        router.refresh();
      }
    },
    [clientId, queryClient, router, updateClient]
  );

  // =============== API =============
  return {
    query,
    updateQuery,
    client,
    errorText,
    initialValues,
    onBack,
    onCancel,
    onSubmit,
  };
}
