'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useCreateTicket } from '@/hooks/requestHooks/useCreateTicket';
import { useGetClients } from '@/hooks/requestHooks/useGetClients';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { Client } from '@/types/types/ClientTypes';
import type { ClientPickerOption } from '@/components/ClientPickerField/ClientPickerField';
import type { CreateTicketFormValues } from '@/types/types/TicketTypes';

// =============== INITIAL VALUES =============

const INITIAL_VALUES: CreateTicketFormValues = {
  clientId: '',
  deviceType: '',
  problemDescription: '',
  priority: 'medium',
};

export function useCreateTicketPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { createTicket, query: createQuery } = useCreateTicket();

  // =============== CLIENT SEARCH =============

  const [clientSearch, setClientSearch] = useState('');
  const [debouncedClientSearch, setDebouncedClientSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedClientSearch(clientSearch.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [clientSearch]);

  const { query: clientsQuery } = useGetClients(debouncedClientSearch);

  const clients: Client[] =
    clientsQuery.data?.success === true
      ? ((clientsQuery.data.data ?? []) as Client[])
      : [];

  const clientOptions: ClientPickerOption[] = clients.map(c => ({
    id: String((c as any)._id ?? (c as any).id ?? ''),
    title: c.fullName,
    subtitle: c.email,
  }));

  // =============== NAV ACTIONS =============

  const onBack = () => router.back();

  const onCancel = () => {
    router.replace('/tickets');
  };

  // =============== SUBMIT =============

  const onSubmit = async (values: CreateTicketFormValues) => {
    try {
      const payload = await createTicket({
        clientId: values.clientId.trim(),
        deviceType: values.deviceType.trim(),
        problemDescription: values.problemDescription.trim(),
        priority: values.priority as any,
      });

      if (ApiConfigService.isSuccess(payload)) {
        await queryClient.invalidateQueries({ queryKey: ['tickets'] });

        toast.success('Заявку успішно створено.');
        router.replace('/tickets');
        router.refresh();
      }
    } catch {}
  };

  return {
    initialValues: INITIAL_VALUES,
    isSubmitting: createQuery.isPending,
    clientSearch,
    clientOptions,
    isClientsLoading: clientsQuery.isFetching,
    setClientSearch,
    onBack,
    onCancel,
    onSubmit,
  };
}
