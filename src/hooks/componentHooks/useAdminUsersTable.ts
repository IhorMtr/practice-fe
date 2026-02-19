'use client';

import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { useGetUsers } from '@/hooks/requestHooks/useGetUsers';
import { useUpdateUser } from '@/hooks/requestHooks/useUpdateUser';
import type { RoleKey, User, UserRole } from '@/types/types/GlobalTypes';

type DraftRoleMap = Record<string, UserRole | undefined>;
type DraftActiveMap = Record<string, boolean | undefined>;

const NONE_VALUE = '';
const ROLE_OPTIONS: RoleKey[] = ['admin', 'manager', 'technician'];

const ROLE_LABEL: Record<RoleKey, string> = {
  admin: 'Адміністратор',
  manager: 'Менеджер',
  technician: 'Майстер',
};

function getUserId(u: User | any): string {
  return (u?._id ?? u?.id) as string;
}

export function useAdminUsersTable() {
  const { query, error, refetchUsers } = useGetUsers();
  const { query: updateQuery, updateUser } = useUpdateUser();

  const [draftRoleById, setDraftRoleById] = useState<DraftRoleMap>({});
  const [draftActiveById, setDraftActiveById] = useState<DraftActiveMap>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const users: User[] =
    query.data?.success === true ? ((query.data.data ?? []) as User[]) : [];

  const errorText = error?.message || '';

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        header: 'Ім’я',
        accessorKey: 'name',
        cell: info => String(info.getValue() ?? '—'),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: info => String(info.getValue() ?? '—'),
      },
      { header: 'Активність', id: 'isActive', cell: () => null },
      { header: 'Роль', id: 'role', cell: () => null },
      { header: '', id: 'action', cell: () => null },
    ];
  }, []);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const refresh = async () => {
    const res = await refetchUsers();

    if (res.data?.success) {
      toast.success('Успішно оновлено');
    }
  };

  const setRoleDraft = (userId: string, role: UserRole) => {
    setDraftRoleById(prev => ({ ...prev, [userId]: role }));
  };

  const setActiveDraft = (userId: string, isActive: boolean) => {
    setDraftActiveById(prev => ({ ...prev, [userId]: isActive }));
  };

  const saveUser = async (user: User): Promise<boolean> => {
    const userId = getUserId(user);
    if (!userId) return false;

    const baseRole = user.role;
    const baseActive = Boolean(user.isActive);

    const nextRole: UserRole = draftRoleById[userId] ?? baseRole;
    const nextActive: boolean = draftActiveById[userId] ?? baseActive;

    const changed = nextRole !== baseRole || nextActive !== baseActive;
    if (!changed) return false;

    try {
      setSavingId(userId);

      const res = await updateUser({
        userId,
        role: nextRole,
        isActive: nextActive,
      });

      if (res?.success !== true) return false;

      await refetchUsers();

      setDraftRoleById(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });

      setDraftActiveById(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });

      return true;
    } finally {
      setSavingId(null);
    }
  };

  return {
    table,
    query,
    updateQuery,
    errorText,
    roleOptions: ROLE_OPTIONS,
    roleLabel: ROLE_LABEL,
    noneValue: NONE_VALUE,
    draftRoleById,
    draftActiveById,
    savingId,
    refresh,
    setRoleDraft,
    setActiveDraft,
    saveUser,
  };
}
