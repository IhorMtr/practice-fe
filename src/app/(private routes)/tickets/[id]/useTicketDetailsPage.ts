'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useGetTicketById } from '@/hooks/requestHooks/useGetTicketById';
import type { Ticket } from '@/types/types/TicketTypes';

export function useTicketDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id ?? '');

  const { query, error } = useGetTicketById(id);

  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const payload = query.data;
    if (!payload || payload.success !== true) {
      setTicket(null);
      return;
    }
    setTicket((payload.data ?? null) as Ticket | null);
  }, [query.data]);

  const errorText = error?.message || '';

  const onBack = () => {
    router.back();
  };

  const onEdit = () => {
    if (!id) return;
    router.push(`/tickets/${id}/edit`);
  };

  const onOpenClient = (clientId: string) => {
    if (!clientId) return;
    router.push(`/clients/${clientId}`);
  };

  return {
    id,
    query,
    ticket,
    errorText,
    onBack,
    onEdit,
    onOpenClient,
  };
}
