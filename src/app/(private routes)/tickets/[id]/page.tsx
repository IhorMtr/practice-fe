'use client';

import {
  actorLabel,
  EMPTY,
  getHistoryActionLabel,
  getHistoryDetails,
  priorityText,
  statusText,
} from '@/utils/helpers/ticketLabels';
import styles from './page.module.scss';
import { useTicketDetailsPage } from './useTicketDetailsPage';

import Rbac from '@/components/Rbac/Rbac';
import type { TicketStatus } from '@/types/types/TicketTypes';
import { formatDate } from '@/utils/helpers/formatDate';

interface HistoryRowProps {
  h: any;
  idx: number;
}

function HistoryRow({ h, idx }: HistoryRowProps) {
  return (
    <tr>
      <td className={styles.historyCell}>{formatDate(h.at)}</td>
      <td className={styles.historyCell}>
        <div className={styles.historyAction}>
          {getHistoryActionLabel(h.action)}
        </div>
        <div className={styles.historyActor}>{actorLabel(h)}</div>
      </td>
      <td className={styles.historyCell}>{getHistoryDetails(h)}</td>
    </tr>
  );
}

export default function TicketDetailsPage() {
  const { query, ticket, errorText, onBack, onEdit, onOpenClient } =
    useTicketDetailsPage();

  return (
    <div className={styles.ticketPage}>
      <section className={styles.ticketSection}>
        <div className={`container ${styles.ticketContainer}`}>
          <header className={styles.ticketHeader}>
            <div className={styles.ticketHeaderText}>
              <h1 className={styles.title}>Заявка</h1>
              <p className={styles.subtitle}>Деталі заявки та історія змін.</p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={onBack}
                disabled={query.isFetching}
              >
                Назад
              </button>

              <Rbac allow={['admin', 'manager', 'technician']}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  onClick={onEdit}
                  disabled={!ticket || query.isFetching}
                >
                  Редагувати
                </button>
              </Rbac>
            </div>
          </header>

          {query.isLoading ? (
            <div className={styles.card}>
              <div className={styles.cardEmpty}>Завантаження…</div>
            </div>
          ) : query.isError ? (
            <div className={styles.card}>
              <div className={styles.cardEmpty}>
                {errorText || 'Не вдалося завантажити заявку.'}
              </div>
            </div>
          ) : !ticket ? (
            <div className={styles.card}>
              <div className={styles.cardEmpty}>Заявку не знайдено.</div>
            </div>
          ) : (
            <>
              <div className={styles.card}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Тип пристрою</div>
                    <div className={styles.infoValueStrong}>
                      {ticket.deviceType}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Статус</div>
                    <div className={styles.infoValue}>
                      {statusText(ticket.status as TicketStatus)}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Пріоритет</div>
                    <div className={styles.infoValue}>
                      {priorityText(ticket.priority)}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Майстер</div>
                    <div className={styles.infoValue}>
                      {ticket.assignedTechnician
                        ? `${ticket.assignedTechnician.name} (${ticket.assignedTechnician.email})`
                        : EMPTY}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Орієнтовна вартість</div>
                    <div className={styles.infoValue}>
                      {ticket.estimatedCost ?? EMPTY}
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Фінальна вартість</div>
                    <div className={styles.infoValue}>
                      {ticket.finalCost ?? EMPTY}
                    </div>
                  </div>

                  <Rbac allow={['admin', 'manager']}>
                    <div className={styles.infoItemFull}>
                      <div className={styles.infoLabel}>Клієнт</div>

                      {ticket.client ? (
                        <button
                          type="button"
                          className={styles.clientLink}
                          onClick={() => onOpenClient(ticket.client!._id)}
                          aria-label={`Відкрити клієнта: ${ticket.client.fullName}`}
                        >
                          <span className={styles.clientName}>
                            {ticket.client.fullName}
                          </span>
                          <span className={styles.clientEmail}>
                            {ticket.client.email}
                          </span>
                        </button>
                      ) : (
                        <div className={styles.infoValueMuted}>{EMPTY}</div>
                      )}
                    </div>
                  </Rbac>

                  <div className={styles.infoItemFull}>
                    <div className={styles.infoLabel}>Опис проблеми</div>
                    <div className={styles.infoValue}>
                      {ticket.problemDescription}
                    </div>
                  </div>

                  <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Створено:</span>{' '}
                      <span className={styles.metaValue}>
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Оновлено:</span>{' '}
                      <span className={styles.metaValue}>
                        {formatDate(ticket.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.sectionTitle}>Історія</h2>
                </div>

                {ticket.history?.length ? (
                  <div className={styles.historyWrap}>
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th className={styles.historyHead}>Час</th>
                          <th className={styles.historyHead}>Дія</th>
                          <th className={styles.historyHead}>Деталі</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticket.history.map((h: any, idx: number) => (
                          <HistoryRow
                            key={`${String(h.at)}-${idx}`}
                            h={h}
                            idx={idx}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.cardEmpty}>Історія поки порожня.</div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
