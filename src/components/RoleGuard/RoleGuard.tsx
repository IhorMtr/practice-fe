'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import type { RoleKey, UserRole } from '@/types/types/GlobalTypes';
import { useClaimsStore } from '@/state/stores/useClaimsStore';

interface RoleGuardProps {
  allow?: RoleKey[];
  redirectTo?: string;
}

export default function RoleGuard({
  allow,
  redirectTo = '/login',
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const claims = useClaimsStore(s => s.claims);
  const isExpired = useClaimsStore(s => s.isExpired);
  const hasRole = useClaimsStore(s => s.hasRole);

  useEffect(() => {
    const noSession = !claims || isExpired();
    if (noSession) {
      if (pathname !== redirectTo) router.replace(redirectTo);
      return;
    }

    const forbidden = !hasRole(allow);
    if (forbidden) router.replace('/');
  }, [allow, claims, hasRole, isExpired, pathname, redirectTo, router]);

  return null;
}
