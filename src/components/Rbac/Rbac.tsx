'use client';

import type { ReactNode } from 'react';

import type { RoleKey } from '@/types/types/GlobalTypes';
import { useClaimsStore } from '@/state/stores/useClaimsStore';

interface RbacProps {
  allow?: RoleKey[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Rbac({ allow, children, fallback = null }: RbacProps) {
  const role = useClaimsStore(s => s.claims?.role ?? null);

  if (!allow || allow.length === 0) return <>{children}</>;
  if (!role) return <>{fallback}</>;

  const ok = allow.includes(role as RoleKey);
  return <>{ok ? children : fallback}</>;
}
