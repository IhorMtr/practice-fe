'use client';

import type { ReactNode } from 'react';
import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import styles from './ClientsTable.module.scss';
import DataTable from '@/components/DataTable/DataTable';
import type { Client } from '@/types/types/ClientTypes';
import { useClientsTable } from '@/hooks/componentHooks/useClientsTable';

type CellRenderer = (cell: Cell<Client, unknown>) => ReactNode;

const getClientId = (c: any): string => String(c?._id ?? c?.id ?? '');

export default function ClientsTable() {
  const {
    table,
    query,
    errorText,
    searchInput,
    setSearchInput,
    clearSearch,
    refresh,
    createClient,
    openClient,
  } = useClientsTable();

  const cellRenderers: Partial<Record<string, CellRenderer>> = {
    fullName: cell => (
      <div className={styles.cellStrong}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    email: cell => (
      <div className={styles.cellMuted}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    notes: cell => (
      <div className={styles.cellNotes}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),
  };

  return (
    <>
      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={refresh}
          disabled={query.isFetching}
        >
          {query.isFetching ? 'Оновлення…' : 'Оновити'}
        </button>

        <button
          type="button"
          className={styles.primaryBtn}
          onClick={createClient}
        >
          Новий клієнт
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Пошук: імʼя або email…"
          disabled={query.isFetching}
        />

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={clearSearch}
          disabled={!searchInput || query.isFetching}
        >
          Очистити
        </button>
      </div>

      <DataTable<Client>
        table={table}
        isLoading={query.isLoading}
        isError={query.isError}
        errorText={errorText || 'Не вдалося завантажити клієнтів.'}
        emptyText="Клієнтів поки немає."
        cellRenderers={cellRenderers}
        onRowClick={row => {
          const id = getClientId(row.original);
          openClient(id);
        }}
      />

      <div className={styles.note}>
        Пошук виконується автоматично під час введення.
      </div>
    </>
  );
}
