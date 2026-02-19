'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useLogout } from '../requestHooks/useLogout';
import type { RoleKey } from '@/types/types/GlobalTypes';
import { useClaimsStore } from '@/state/stores/useClaimsStore';

type NavItem = {
  label: string;
  href: string;
  roles?: RoleKey[];
};

export function useSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { logout, query, error } = useLogout();

  const role = useClaimsStore(s => s.claims?.role ?? null);
  const clearClaims = useClaimsStore(s => s.clear);

  // =============== NAV ITEMS =============

  const navItems: NavItem[] = useMemo(() => {
    const all: NavItem[] = [
      { label: 'Головна', href: '/' },
      { label: 'Заявки', href: '/tickets' },
      { label: 'Клієнти', href: '/clients', roles: ['admin', 'manager'] },
      { label: 'Користувачі', href: '/admin/users', roles: ['admin'] },
    ];

    return all.filter(i => {
      if (!i.roles) return true;
      if (!role) return false;
      return i.roles.includes(role as RoleKey);
    });
  }, [role]);

  // =============== ACTIVE LINK =============

  const exact = navItems.find(i => i.href === pathname)?.href;

  const byPrefix = navItems.find(
    i => i.href !== '/' && pathname?.startsWith(i.href)
  )?.href;

  const activeHref = exact ?? byPrefix ?? '/';

  // =============== LOGOUT =============

  const logoutErrorText =
    error?.message ||
    (error ? 'Не вдалося вийти з системи. Спробуйте ще раз.' : '');

  const onLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      clearClaims();
      queryClient.clear();

      router.replace('/login');
    }
  }, [logout, clearClaims, queryClient, router]);

  return {
    navItems,
    activeHref,
    isLoggingOut: query.isPending,
    logoutErrorText,
    onLogout,
  };
}
