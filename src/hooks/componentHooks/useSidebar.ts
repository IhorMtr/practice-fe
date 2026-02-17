'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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

  const { logout, query, error } = useLogout();

  const role = useClaimsStore(s => s.claims?.role ?? null);

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
  const activeHref = useMemo(() => {
    const exact = navItems.find(i => i.href === pathname)?.href;
    if (exact) return exact;

    const byPrefix = navItems.find(
      i => i.href !== '/' && pathname?.startsWith(i.href)
    );
    return byPrefix?.href ?? '/';
  }, [navItems, pathname]);

  // =============== LOGOUT =============
  const logoutErrorText = useMemo(() => {
    if (!error) return '';
    return error.message || 'Не вдалося вийти з системи. Спробуйте ще раз.';
  }, [error]);

  const onLogout = useCallback(async () => {
    try {
      await logout();
      router.replace('/login');
      router.refresh();
    } catch {}
  }, [logout, router]);

  return {
    navItems,
    activeHref,
    isLoggingOut: query.isPending,
    logoutErrorText,
    onLogout,
  };
}
