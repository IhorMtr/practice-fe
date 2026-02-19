'use client';

import type { ReactNode } from 'react';
import type { Cell } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import styles from './TicketsTable.module.scss';
import DataTable from '@/components/DataTable/DataTable';
import type { Ticket } from '@/types/types/TicketTypes';
import { useClaimsStore } from '@/state/stores/useClaimsStore';
import { useTicketsTable } from '@/hooks/componentHooks/useTicketTable';

type CellRenderer = (cell: Cell<Ticket, unknown>) => ReactNode;

const getTicketId = (t: any): string => String(t?._id ?? t?.id ?? '');

export default function TicketsTable() {
  const role = useClaimsStore(s => s.claims?.role ?? null);

  const {
    table,
    query,
    errorText,
    searchInput,
    setSearchInput,
    clearSearch,
    refresh,
    createTicket,
    openTicket,
  } = useTicketsTable();

  const canCreate = role === 'admin' || role === 'manager';

  const cellRenderers: Partial<Record<string, CellRenderer>> = {
    deviceType: cell => (
      <div className={styles.cellStrong}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    status: cell => (
      <div className={styles.cellBadge}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    priority: cell => (
      <div className={styles.cellBadgeMuted}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    ),

    createdAt: cell => {
      const raw = String(cell.getValue() ?? '');
      const d = raw ? new Date(raw) : null;
      const text =
        d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('de-DE') : '—';

      return <div className={styles.cellMuted}>{text}</div>;
    },
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

        {canCreate ? (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={createTicket}
          >
            Нова заявка
          </button>
        ) : null}
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Пошук: пристрій або опис…"
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

      <DataTable<Ticket>
        table={table}
        isLoading={query.isLoading}
        isError={query.isError}
        errorText={errorText || 'Не вдалося завантажити заявки.'}
        emptyText="Заявок поки немає."
        cellRenderers={cellRenderers}
        onRowClick={row => {
          const id = getTicketId(row.original);
          openTicket(id);
        }}
      />

      <div className={styles.note}>
        Пошук виконується автоматично під час введення.
      </div>
    </>
  );
}
