'use client';

import type { ReactNode } from 'react';
import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import toast from 'react-hot-toast';

import styles from './AdminUsersTable.module.scss';
import DataTable from '@/components/DataTable/DataTable';
import { useAdminUsersTable } from '@/hooks/componentHooks/useAdminUsersTable';
import type { RoleKey, User } from '@/types/types/GlobalTypes';

type CellRenderer = (cell: Cell<User, unknown>) => ReactNode;

const getUserId = (u: User | any): string => (u?._id ?? u?.id) as string;

export default function AdminUsersTable() {
  const {
    table,
    query,
    updateQuery,
    errorText,
    roleOptions,
    roleLabel,
    noneValue,
    draftRoleById,
    draftActiveById,
    savingId,
    refresh,
    setRoleDraft,
    setActiveDraft,
    saveUser,
  } = useAdminUsersTable();

  const cellRenderers: Partial<Record<string, CellRenderer>> = {
    name: cell => (
      <div className={styles.cellStrong}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    email: cell => (
      <div className={styles.cellMuted}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    isActive: cell => {
      const u = cell.row.original as User;
      const userId = getUserId(u);

      const checked = (draftActiveById[userId] ??
        Boolean(u.isActive)) as boolean;
      const disabled = savingId === userId;

      return (
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={checked}
            onChange={e => setActiveDraft(userId, e.target.checked)}
            disabled={disabled}
          />
          <span className={styles.checkboxText}>
            {checked ? 'Активний' : 'Неактивний'}
          </span>
        </label>
      );
    },

    role: cell => {
      const u = cell.row.original as User;
      const userId = getUserId(u);

      const selected = draftRoleById[userId] ?? u.role;
      const value = (selected ?? noneValue) as string;
      const disabled = savingId === userId;

      return (
        <select
          className={styles.select}
          value={value}
          onChange={e => {
            const v = e.target.value;
            const nextRole = v === noneValue ? null : (v as RoleKey);
            setRoleDraft(userId, nextRole);
          }}
          disabled={disabled}
        >
          <option value={noneValue}>Без ролі</option>

          {roleOptions.map(r => (
            <option key={r} value={r}>
              {roleLabel[r]}
            </option>
          ))}
        </select>
      );
    },

    action: cell => {
      const u = cell.row.original as User;
      const userId = getUserId(u);

      const selectedRole = draftRoleById[userId] ?? u.role;
      const selectedActive = (draftActiveById[userId] ??
        Boolean(u.isActive)) as boolean;

      const changed =
        selectedRole !== u.role || selectedActive !== Boolean(u.isActive);

      const saving = savingId === userId;

      return (
        <div className={styles.actionCell}>
          <button
            type="button"
            className={changed ? styles.primaryBtn : styles.disabledBtn}
            onClick={async () => {
              const ok = await saveUser(u);
              if (ok) toast.success('Зміни успішно збережено.');
            }}
            disabled={!changed || saving}
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </button>
        </div>
      );
    },
  };

  return (
    <>
      <div className={styles.tableHeader}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={refresh}
          disabled={query.isFetching}
        >
          {query.isFetching ? 'Оновлення…' : 'Оновити'}
        </button>
      </div>

      <DataTable<User>
        table={table}
        isLoading={query.isLoading}
        isError={query.isError}
        errorText={errorText || 'Не вдалося завантажити користувачів.'}
        emptyText="Користувачів поки немає."
        cellRenderers={cellRenderers}
      />

      <div className={styles.note}>
        {updateQuery.isPending
          ? 'Зміни зберігаються…'
          : 'Зміни набудуть чинності одразу після збереження.'}
      </div>
    </>
  );
}
