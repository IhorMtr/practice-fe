'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { useGetTicketById } from '@/hooks/requestHooks/useGetTicketById';
import { useUpdateTicketByManager } from '@/hooks/requestHooks/useUpdateTicketByManager';
import { useGetTechnicians } from '@/hooks/requestHooks/useGetTechnicians';
import { useUpdateTicketStatus } from '@/hooks/requestHooks/useUpdateTicketStatus';
import type { EditTicketFormValues, Ticket } from '@/types/types/TicketTypes';
import type { User } from '@/types/types/GlobalTypes';
import type { TechnicianOption } from '@/components/TicketEditForm/TicketEditForm';
import { useClaimsStore } from '@/state/stores/useClaimsStore';

function numOrNull(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const toId = (u: any) => String(u?._id ?? u?.id ?? '');

export function useEditTicketPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = String(params?.id ?? '');
  const queryClient = useQueryClient();

  const role = useClaimsStore(s => s.claims?.role ?? null);
  const canManage = role === 'admin' || role === 'manager';

  // =============== DATA: TICKET =============

  const { query, error } = useGetTicketById(ticketId);

  // =============== MUTATIONS =============

  const { query: updateQuery, updateTicketByManager } =
    useUpdateTicketByManager();

  const { query: statusQuery, updateTicketStatus } = useUpdateTicketStatus();

  // =============== DATA: TECHNICIANS =============

  const { query: techQuery } = useGetTechnicians({ enabled: canManage });

  // =============== PARSE TICKET =============
  const payload = query.data;
  const ticket: Ticket | null =
    payload && payload.success === true
      ? ((payload.data ?? null) as any)
      : null;

  const errorText = error?.message || '';

  // =============== FORM INITIAL VALUES =============

  const initialValues = useMemo<EditTicketFormValues>(() => {
    const t = ticket;

    return {
      deviceType: t?.deviceType ?? '',
      problemDescription: t?.problemDescription ?? '',
      priority: (t?.priority ?? 'medium') as any,

      assignedTechnicianId: t?.assignedTechnician?._id ?? '',
      estimatedCost:
        t?.estimatedCost === null ? '' : String(t?.estimatedCost ?? ''),
      finalCost: t?.finalCost === null ? '' : String(t?.finalCost ?? ''),

      status: (t?.status ?? 'new') as any,
      statusComment: '',
    };
  }, [ticket]);

  // =============== TECHNICIAN SELECT OPTIONS =============

  const technicianOptions = useMemo<TechnicianOption[]>(() => {
    if (!canManage) return [];

    const techPayload = techQuery.data;
    if (!techPayload || techPayload.success !== true) return [];

    const techs = (techPayload.data ?? []) as User[];
    const activeTechs = techs.filter(t => Boolean(t.isActive));

    const options: TechnicianOption[] = activeTechs
      .map(t => {
        const id = toId(t);
        if (!id) return null;
        return { value: id, label: `${t.name} (${t.email})` };
      })
      .filter(Boolean) as TechnicianOption[];

    const current = ticket?.assignedTechnician ?? null;
    const currentId = current?._id ?? '';
    if (currentId && !options.some(o => o.value === currentId)) {
      options.unshift({
        value: currentId,
        label: `${current?.name ?? 'Майстер'} (${current?.email ?? currentId})`,
      });
    }

    return options;
  }, [canManage, techQuery.data, ticket?.assignedTechnician]);

  // =============== UI STATE =============

  const isSaving = updateQuery.isPending || statusQuery.isPending;

  // =============== NAV ACTIONS =============

  const onBack = () => router.back();

  const onCancel = () => {
    if (!ticketId) return;
    router.replace(`/tickets/${ticketId}`);
  };

  // =============== CACHE INVALIDATION =============

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tickets'] });
    await queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
  };

  // =============== SUBMIT: ADMIN/MANAGER =============

  const onSubmitFull = async (values: EditTicketFormValues) => {
    if (!ticketId) return;

    const techId = values.assignedTechnicianId.trim();

    const res = await updateTicketByManager({
      ticketId,
      deviceType: values.deviceType.trim(),
      problemDescription: values.problemDescription.trim(),
      priority: values.priority as any,
      assignedTechnicianId: techId ? techId : null,
      estimatedCost: numOrNull(values.estimatedCost),
      finalCost: numOrNull(values.finalCost),
    });
    if (res?.success !== true) return;

    const currentStatus = (ticket?.status ?? 'new') as any;
    if (ticket && values.status !== currentStatus) {
      const comment = values.statusComment.trim() || null;

      const statusRes = await updateTicketStatus({
        ticketId,
        status: values.status as any,
        comment,
      });
      if (statusRes?.success !== true) return;
    }

    await invalidate();
    toast.success('Зміни успішно збережено.');
    router.replace(`/tickets/${ticketId}`);
    router.refresh();
  };

  // =============== SUBMIT: TECHNICIAN =============

  const onSubmitStatus = async (values: EditTicketFormValues) => {
    if (!ticketId) return;

    const comment = values.statusComment.trim();

    const statusRes = await updateTicketStatus({
      ticketId,
      status: values.status as any,
      comment: comment || null,
    });
    if (statusRes?.success !== true) return;

    await invalidate();
    toast.success('Статус оновлено.');
    router.replace(`/tickets/${ticketId}`);
    router.refresh();
  };

  return {
    ticketId,
    role,
    canManage,
    query,
    updateQuery,
    statusQuery,
    ticket,
    errorText,
    initialValues,
    technicianOptions,
    isTechniciansLoading:
      canManage && (techQuery.isLoading || techQuery.isFetching),
    isSaving,
    onBack,
    onCancel,
    onSubmitFull,
    onSubmitStatus,
  };
}
