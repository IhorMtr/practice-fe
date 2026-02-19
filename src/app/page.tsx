'use client';

import styles from './page.module.scss';
import AppShell from '@/components/AppShell/AppShellt';
import Rbac from '@/components/Rbac/Rbac';
import { useHomePage } from './useHomePage';
import { priorityText, statusText } from '@/utils/helpers/ticketLabels';

function formatDate(value?: string | Date) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('uk-UA');
}

export default function Home() {
  const {
    title,
    ticketsQuery,
    ticketsErrorText,
    stats,
    recentTickets,
    onOpenTickets,
    onOpenClients,
    onAddClient,
    onOpenUsers,
    onOpenTicket,
  } = useHomePage();

  const statLoading = ticketsQuery.isLoading || ticketsQuery.isFetching;

  return (
    <AppShell>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Головна</h1>
              <p className={styles.subtitle}>
                {title}. Короткий огляд заявок та швидкі дії.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            <article
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={onOpenTickets}
            >
              <div className={styles.cardTitle}>Активні заявки</div>
              <div className={styles.cardValue}>
                {statLoading ? '…' : stats.activeCount}
              </div>
              <div className={styles.cardHint}>
                {statusText('new')} та {statusText('in_progress')}
              </div>
            </article>

            <article
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={onOpenTickets}
            >
              <div className={styles.cardTitle}>Очікує погодження</div>
              <div className={styles.cardValue}>
                {statLoading ? '…' : stats.awaitingApprovalCount}
              </div>
              <div className={styles.cardHint}>
                Запланована ціна та статус {statusText('new')}
              </div>
            </article>

            <article
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={onOpenTickets}
            >
              <div className={styles.cardTitle}>Готово сьогодні</div>
              <div className={styles.cardValue}>
                {statLoading ? '…' : stats.doneTodayCount}
              </div>
              <div className={styles.cardHint}>Статус {statusText('done')}</div>
            </article>
          </div>

          <div className={styles.split}>
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.h2}>Останні заявки</h2>
              </div>

              {ticketsQuery.isLoading ? (
                <div className={styles.empty}>Завантаження…</div>
              ) : ticketsQuery.isError ? (
                <div className={styles.error}>
                  {ticketsErrorText || 'Не вдалося завантажити заявки.'}
                </div>
              ) : recentTickets.length === 0 ? (
                <div className={styles.empty}>Даних поки немає.</div>
              ) : (
                <ul className={styles.ticketList}>
                  {recentTickets.map(t => (
                    <li key={t._id} className={styles.ticketItem}>
                      <button
                        type="button"
                        className={styles.ticketBtn}
                        onClick={() => onOpenTicket(t._id)}
                      >
                        <div className={styles.ticketTop}>
                          <div className={styles.ticketTitle}>
                            {t.deviceType}
                          </div>
                          <div className={styles.ticketMeta}>
                            {formatDate(t.updatedAt)}
                          </div>
                        </div>

                        <div className={styles.ticketBottom}>
                          <div className={styles.ticketSub}>
                            {t.client?.fullName
                              ? t.client.fullName
                              : 'Клієнт: —'}
                          </div>

                          <div className={styles.ticketBadges}>
                            <span className={styles.badge}>
                              {statusText(t.status)}
                            </span>
                            <span className={styles.badgeSecondary}>
                              {priorityText(t.priority)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.h2}>Швидкі дії</h2>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={onOpenTickets}
                >
                  Перейти до заявок
                </button>

                <Rbac allow={['admin', 'manager']}>
                  <button
                    type="button"
                    className={styles.actionBtnSecondary}
                    onClick={onOpenClients}
                  >
                    Перейти до клієнтів
                  </button>

                  <button
                    type="button"
                    className={styles.actionBtnSecondary}
                    onClick={onAddClient}
                  >
                    Додати клієнта
                  </button>
                </Rbac>

                <Rbac allow={['admin']}>
                  <button
                    type="button"
                    className={styles.actionBtnSecondary}
                    onClick={onOpenUsers}
                  >
                    Користувачі (адмін)
                  </button>
                </Rbac>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
