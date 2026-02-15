'use client';

import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';

import { useLogout } from '@/hooks/requestHooks/useLogout';

type NavItem = {
  label: string;
  href: string;
};

export function useHomePage() {
  const router = useRouter();
  const pathname = usePathname();

  const { logout, query, error } = useLogout();

  const navItems: NavItem[] = useMemo(
    () => [
      { label: 'Головна', href: '/' },
      { label: 'Заявки', href: '/requests' },
      { label: 'Клієнти', href: '/clients' },
      { label: 'Пристрої', href: '/devices' },
      { label: 'Майстри', href: '/technicians' },
      { label: 'Налаштування', href: '/settings' },
    ],
    []
  );

  const activeHref = useMemo(() => {
    const exact = navItems.find(i => i.href === pathname)?.href;
    if (exact) return exact;

    const byPrefix = navItems.find(
      i => i.href !== '/' && pathname?.startsWith(i.href)
    );
    return byPrefix?.href ?? '/';
  }, [navItems, pathname]);

  const onLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Ви успішно вийшли з системи');
      router.replace('/login');
      router.refresh();
    } catch {}
  }, [logout, router]);

  const logoutErrorText = useMemo(() => {
    if (!error) return '';
    return error.message || 'Не вдалося вийти з системи. Спробуйте ще раз.';
  }, [error]);

  return {
    navItems,
    activeHref,
    isLoggingOut: query.isPending,
    logoutErrorText,
    onLogout,
  };
}
