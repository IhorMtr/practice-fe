'use client';

import RoleGuard from '../RoleGuard/RoleGuard';

export default function ClientsGuard() {
  return <RoleGuard allow={['admin', 'manager']} />;
}
