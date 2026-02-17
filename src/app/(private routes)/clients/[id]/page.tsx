'use client';

import styles from './page.module.scss';
import { useClientDetailsPage } from './useClientDetailsPage';

export default function ClientDetailsPage() {
  const { query, client, errorText, onBack, onEdit } = useClientDetailsPage();

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Клієнт</h1>
              <p className={styles.subtitle}>Деталі клієнта та нотатки.</p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onBack}
                disabled={query.isFetching}
              >
                Назад
              </button>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onEdit}
                disabled={!client || query.isFetching}
              >
                Редагувати
              </button>
            </div>
          </div>

          {query.isLoading ? (
            <div className={styles.card}>
              <div className={styles.empty}>Завантаження…</div>
            </div>
          ) : query.isError ? (
            <div className={styles.card}>
              <div className={styles.empty}>
                {errorText || 'Не вдалося завантажити клієнта.'}
              </div>
            </div>
          ) : !client ? (
            <div className={styles.card}>
              <div className={styles.empty}>Клієнта не знайдено.</div>
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.infoGrid}>
                <div className={styles.infoBlock}>
                  <div className={styles.label}>Імʼя</div>
                  <div className={styles.valueStrong}>{client.fullName}</div>
                </div>

                <div className={styles.infoBlock}>
                  <div className={styles.label}>Email</div>
                  <div className={styles.valueMuted}>{client.email}</div>
                </div>

                <div className={styles.infoBlockFull}>
                  <div className={styles.label}>Нотатки</div>
                  <div className={styles.value}>
                    {client.notes ? client.notes : '—'}
                  </div>
                </div>
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Створено:</span>{' '}
                  {client.createdAt
                    ? new Date(client.createdAt).toLocaleString()
                    : '—'}
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Оновлено:</span>{' '}
                  {client.updatedAt
                    ? new Date(client.updatedAt).toLocaleString()
                    : '—'}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
