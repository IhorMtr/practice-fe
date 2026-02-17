'use client';

import { flexRender } from '@tanstack/react-table';

import styles from './page.module.scss';
import { useAdminUsersPage } from './useAdminUsersPage';

import type { User, UserRole } from '@/types/types/GlobalTypes';

type RoleKey = Exclude<UserRole, null>;

export default function AdminUsersPage() {
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
    onRefresh,
    onChangeRole,
    onChangeActive,
    onSaveUser,
  } = useAdminUsersPage();

  const rows = table.getRowModel().rows;

  // =============== HELPERS =============
  const getUserId = (u: User | any): string => (u?._id ?? u?.id) as string;

  const getDraftRole = (u: User): UserRole => {
    const userId = getUserId(u);
    return (userId ? draftRoleById[userId] : undefined) ?? u.role;
  };

  const getDraftActive = (u: User): boolean => {
    const userId = getUserId(u);
    return (
      (userId ? draftActiveById[userId] : undefined) ?? Boolean(u.isActive)
    );
  };

  const renderNameCell = (cell: any) => (
    <td key={cell.id} className={styles.td}>
      <div className={styles.cellStrong}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </td>
  );

  const renderEmailCell = (cell: any) => (
    <td key={cell.id} className={styles.td}>
      <div className={styles.cellMuted}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </td>
  );

  const renderActiveCell = (cell: any) => {
    const u = cell.row.original as User;
    const userId = getUserId(u);
    const disabled = savingId === userId;

    const checked = getDraftActive(u);

    return (
      <td key={cell.id} className={styles.td}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={checked}
            onChange={e => onChangeActive(userId, e.target.checked)}
            disabled={disabled}
          />
          <span className={styles.checkboxText}>
            {checked ? 'Активний' : 'Неактивний'}
          </span>
        </label>
      </td>
    );
  };

  const renderRoleCell = (cell: any) => {
    const u = cell.row.original as User;
    const userId = getUserId(u);

    const selected = getDraftRole(u);
    const value = (selected ?? noneValue) as string;

    const disabled = savingId === userId;

    return (
      <td key={cell.id} className={styles.td}>
        <select
          className={styles.select}
          value={value}
          onChange={e => {
            const v = e.target.value;
            const nextRole = v === noneValue ? null : (v as RoleKey);
            onChangeRole(userId, nextRole);
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
      </td>
    );
  };

  const renderActionCell = (cell: any) => {
    const u = cell.row.original as User;
    const userId = getUserId(u);

    const selectedRole = getDraftRole(u);
    const selectedActive = getDraftActive(u);

    const changed =
      selectedRole !== u.role || selectedActive !== Boolean(u.isActive);
    const saving = savingId === userId;

    return (
      <td key={cell.id} className={styles.td}>
        <div className={styles.actionCell}>
          <button
            type="button"
            className={changed ? styles.primaryBtn : styles.disabledBtn}
            onClick={() => onSaveUser(u)}
            disabled={!changed || saving}
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </button>
        </div>
      </td>
    );
  };

  const renderDefaultCell = (cell: any) => (
    <td key={cell.id} className={styles.td}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );

  const renderCell = (cell: any) => {
    const colId = cell.column.id;

    if (colId === 'name') return renderNameCell(cell);
    if (colId === 'email') return renderEmailCell(cell);
    if (colId === 'isActive') return renderActiveCell(cell);
    if (colId === 'role') return renderRoleCell(cell);
    if (colId === 'action') return renderActionCell(cell);

    return renderDefaultCell(cell);
  };

  // =============== RENDER =============
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Користувачі</h1>
              <p className={styles.subtitle}>
                Тут адміністратор може призначати ролі користувачам.
              </p>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onRefresh}
              disabled={query.isFetching}
            >
              {query.isFetching ? 'Оновлення…' : 'Оновити'}
            </button>
          </div>

          <div className={styles.card}>
            {query.isLoading ? (
              <div className={styles.empty}>Завантаження…</div>
            ) : query.isError ? (
              <div className={styles.empty}>
                {errorText || 'Не вдалося завантажити користувачів.'}
              </div>
            ) : rows.length === 0 ? (
              <div className={styles.empty}>Користувачів поки немає.</div>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id} className={styles.th}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id} className={styles.tr}>
                        {row.getVisibleCells().map(renderCell)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.note}>
            {updateQuery.isPending
              ? 'Зміни зберігаються…'
              : 'Зміни набудуть чинності одразу після збереження.'}
          </div>
        </div>
      </section>
    </div>
  );
}
