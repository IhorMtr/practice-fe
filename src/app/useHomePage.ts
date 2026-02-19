'use client';

import { useRouter } from 'next/navigation';

import { useClaimsStore } from '@/state/stores/useClaimsStore';
import { useGetTickets } from '@/hooks/requestHooks/useGetTickets';
import type { GetTicketsRequest } from '@/types/interfaces/TicketInterfaces';
import type { Ticket, TicketStatus } from '@/types/types/TicketTypes';

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateSafe(v: unknown): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function useHomePage() {
  const router = useRouter();
  const role = useClaimsStore(s => s.claims?.role ?? null);

  const ticketsParams: GetTicketsRequest = {};
  const { query: ticketsQuery, error: ticketsError } =
    useGetTickets(ticketsParams);

  const title = (() => {
    if (role === 'admin') return 'Адміністратор';
    if (role === 'manager') return 'Менеджер';
    if (role === 'technician') return 'Майстер';
    return 'Користувач';
  })();

  const tickets: Ticket[] = (() => {
    const payload = ticketsQuery.data;
    if (!payload || payload.success !== true) return [];
    return (payload.data ?? []) as Ticket[];
  })();

  const stats = (() => {
    const today = new Date();

    const isActive = (s: TicketStatus) => s === 'new' || s === 'in_progress';

    const activeCount = tickets.filter(t =>
      isActive(t.status as TicketStatus)
    ).length;

    const awaitingApprovalCount = tickets.filter(
      t => (t.status as TicketStatus) === 'new' && t.estimatedCost !== null
    ).length;

    const doneTodayCount = tickets.filter(t => {
      if ((t.status as TicketStatus) !== 'done') return false;
      const upd = toDateSafe(t.updatedAt);
      return upd ? isSameDay(upd, today) : false;
    }).length;

    return { activeCount, awaitingApprovalCount, doneTodayCount };
  })();

  const recentTickets = (() => {
    const sorted = [...tickets].sort((a, b) => {
      const ad = toDateSafe(a.updatedAt)?.getTime() ?? 0;
      const bd = toDateSafe(b.updatedAt)?.getTime() ?? 0;
      return bd - ad;
    });
    return sorted.slice(0, 6);
  })();

  const ticketsErrorText = ticketsError?.message || '';

  const onOpenTickets = () => {
    router.push('/tickets');
  };

  const onOpenClients = () => {
    router.push('/clients');
  };

  const onAddClient = () => {
    router.push('/clients/new');
  };

  const onOpenUsers = () => {
    router.push('/admin/users');
  };

  const onOpenTicket = (ticketId: string) => {
    if (!ticketId) return;
    router.push(`/tickets/${ticketId}`);
  };

  return {
    role,
    title,

    ticketsQuery,
    ticketsErrorText,
    stats,
    recentTickets,

    onOpenTickets,
    onOpenClients,
    onAddClient,
    onOpenUsers,
    onOpenTicket,
  };
}
