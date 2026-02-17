'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import toast from 'react-hot-toast';

import { useGetUsers } from '@/hooks/requestHooks/useGetUsers';
import { useUpdateUser } from '@/hooks/requestHooks/useUpdateUser';

import type { User, UserRole } from '@/types/types/GlobalTypes';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

type RoleKey = Exclude<UserRole, null>;
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

export function useAdminUsersPage() {
  // =============== QUERIES =============
  const { query, error, refetchUsers } = useGetUsers();
  const {
    query: updateQuery,
    error: updateError,
    updateUser,
  } = useUpdateUser();

  // =============== LOCAL STATE =============
  const [draftRoleById, setDraftRoleById] = useState<DraftRoleMap>({});
  const [draftActiveById, setDraftActiveById] = useState<DraftActiveMap>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  // =============== DERIVED DATA =============
  const users: User[] = useMemo(() => {
    const payload = query.data;
    if (!payload || payload.success !== true) return [];
    return (payload.data ?? []) as User[];
  }, [query.data]);

  const errorText = useMemo(() => {
    return error?.message || '';
  }, [error?.message]);

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

  // =============== TABLE =============
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // =============== ACTIONS =============
  const onRefresh = useCallback(() => {
    refetchUsers();
  }, [refetchUsers]);

  const onChangeRole = useCallback((userId: string, role: UserRole) => {
    setDraftRoleById(prev => ({ ...prev, [userId]: role }));
  }, []);

  const onChangeActive = useCallback((userId: string, isActive: boolean) => {
    setDraftActiveById(prev => ({ ...prev, [userId]: isActive }));
  }, []);

  const onSaveUser = useCallback(
    async (user: User) => {
      const userId = getUserId(user);
      if (!userId) return;

      const baseRole = user.role;
      const baseActive = Boolean(user.isActive);

      const nextRole: UserRole = draftRoleById[userId] ?? baseRole;
      const nextActive: boolean = draftActiveById[userId] ?? baseActive;

      const changed = nextRole !== baseRole || nextActive !== baseActive;
      if (!changed) return;

      try {
        setSavingId(userId);

        const res = await updateUser({
          userId,
          role: nextRole,
          isActive: nextActive,
        });

        if (res?.success !== true) {
          toast.error(res?.message || 'Сталася помилка.');
          return;
        }

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

        toast.success('Зміни успішно збережено.');
      } catch (err) {
        const apiErr = ApiConfigService.getApiErrorPayload(err);
        toast.error(
          apiErr?.message || updateError?.message || 'Сталася помилка.'
        );
      } finally {
        setSavingId(null);
      }
    },
    [
      draftActiveById,
      draftRoleById,
      refetchUsers,
      updateError?.message,
      updateUser,
    ]
  );

  // =============== API =============
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
    onRefresh,
    onChangeRole,
    onChangeActive,
    onSaveUser,
  };
}
