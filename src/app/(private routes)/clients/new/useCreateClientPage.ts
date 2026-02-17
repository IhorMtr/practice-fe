'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { useCreateClient } from '@/hooks/requestHooks/useCreateClient';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import { CreateClientFormValues } from '@/types/types/ClientTypes';

// =============== TYPES =============

export function useCreateClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { createClient, query } = useCreateClient();

  // =============== STATE =============
  const initialValues = useMemo<CreateClientFormValues>(
    () => ({
      fullName: '',
      email: '',
      notes: '',
    }),
    []
  );

  // =============== ACTIONS =============
  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onCancel = useCallback(() => {
    router.replace('/clients');
  }, [router]);

  const onSubmit = useCallback(
    async (values: CreateClientFormValues) => {
      const fullName = values.fullName.trim();
      const email = values.email.trim().toLowerCase();
      const notes = values.notes.trim();

      const payload = await createClient({
        fullName,
        email,
        notes: notes ? notes : null,
      });

      if (ApiConfigService.isSuccess(payload)) {
        await queryClient.invalidateQueries({ queryKey: ['clients'] });

        toast.success('Клієнта успішно створено.');
        router.replace('/clients');
        router.refresh();
      }
    },
    [createClient, queryClient, router]
  );

  return {
    initialValues,
    isSubmitting: query.isPending,
    onBack,
    onCancel,
    onSubmit,
  };
}
