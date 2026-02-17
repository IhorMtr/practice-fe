'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useClaimsStore } from '@/state/stores/useClaimsStore';

export function useHomePage() {
  const router = useRouter();
  const role = useClaimsStore(s => s.claims?.role ?? null);

  const title = useMemo(() => {
    if (role === 'admin') return 'Адміністратор';
    if (role === 'manager') return 'Менеджер';
    if (role === 'technician') return 'Майстер';
    return 'Користувач';
  }, [role]);

  const onOpenTickets = useCallback(() => {
    router.push('/tickets');
  }, [router]);

  const onOpenClients = useCallback(() => {
    router.push('/clients');
  }, [router]);

  const onAddClient = useCallback(() => {
    router.push('/clients/new');
  }, [router]);

  const onOpenUsers = useCallback(() => {
    router.push('/admin/users');
  }, [router]);

  return {
    role,
    title,
    onOpenTickets,
    onOpenClients,
    onAddClient,
    onOpenUsers,
  };
}
