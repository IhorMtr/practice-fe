'use client';

import { flexRender } from '@tanstack/react-table';
import type { Cell, Row, Table } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import styles from './DataTable.module.scss';

type CellRenderer<T> = (cell: Cell<T, unknown>) => ReactNode;

interface DataTableProps<T> {
  table: Table<T>;
  isLoading?: boolean;
  isError?: boolean;
  errorText?: string;
  emptyText?: string;
  loadingText?: string;
  cellRenderers?: Partial<Record<string, CellRenderer<T>>>;
  onRowClick?: (row: Row<T>) => void;
}

export default function DataTable<T>({
  table,
  isLoading,
  isError,
  errorText,
  emptyText = 'Даних поки немає.',
  loadingText = 'Завантаження…',
  cellRenderers,
  onRowClick,
}: DataTableProps<T>) {
  const rows = table.getRowModel().rows;
  const clickable = Boolean(onRowClick);

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.empty}>{loadingText}</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.card}>
        <div className={styles.error}>
          {errorText || 'Сталася помилка під час завантаження.'}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.empty}>{emptyText}</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
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
              <tr
                key={row.id}
                className={`${styles.tr} ${clickable ? styles.trClickable : ''}`}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                onKeyDown={
                  clickable
                    ? e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick?.(row);
                        }
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map(cell => {
                  const colId = cell.column.id;
                  const custom = cellRenderers?.[colId];

                  return (
                    <td key={cell.id} className={styles.td}>
                      {custom
                        ? custom(cell)
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
