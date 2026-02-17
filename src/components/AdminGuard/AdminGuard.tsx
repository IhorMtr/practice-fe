'use client';

import RoleGuard from '../RoleGuard/RoleGuard';

export default function AdminGuard() {
  return <RoleGuard allow={['admin']} />;
}
