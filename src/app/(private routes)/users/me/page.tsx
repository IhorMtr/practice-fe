'use client';

import styles from './page.module.scss';
import { useMePage } from './useMePage';

export default function MePage() {
  const { me, isLoading, createdAtText, updatedAtText, onRetry } = useMePage();

  return (
    <section className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Профіль</h1>
            <p className={styles.subtitle}>Ваші дані облікового запису</p>
          </div>

          <button
            type="button"
            className={styles.refreshBtn}
            onClick={onRetry}
            disabled={isLoading}
          >
            {isLoading ? 'Оновлення…' : 'Оновити'}
          </button>
        </div>

        <div className={styles.card}>
          {isLoading && !me ? (
            <div className={styles.skeleton}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
            </div>
          ) : null}

          {!isLoading && me ? (
            <>
              <div className={styles.cardHeader}>
                <div className={styles.avatar} aria-hidden="true" />
                <div className={styles.cardHeaderText}>
                  <div className={styles.nameRow}>
                    <div className={styles.name}>{me.name}</div>
                    <span
                      className={`${styles.badge} ${
                        me.isActive ? styles.badgeActive : styles.badgeInactive
                      }`}
                    >
                      {me.isActive ? 'Активний' : 'Неактивний'}
                    </span>
                  </div>
                  <div className={styles.email}>{me.email}</div>
                </div>
              </div>

              <div className={styles.kv}>
                <div className={styles.kvRow}>
                  <div className={styles.kvLabel}>ID</div>
                  <div className={styles.kvValue}>{me._id}</div>
                </div>

                <div className={styles.kvRow}>
                  <div className={styles.kvLabel}>Роль</div>
                  <div className={styles.kvValue}>{me.role}</div>
                </div>

                <div className={styles.kvRow}>
                  <div className={styles.kvLabel}>Створено</div>
                  <div className={styles.kvValue}>{createdAtText}</div>
                </div>

                <div className={styles.kvRow}>
                  <div className={styles.kvLabel}>Оновлено</div>
                  <div className={styles.kvValue}>{updatedAtText}</div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
