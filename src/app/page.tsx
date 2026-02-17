import styles from './page.module.scss';
import AppShell from '@/components/AppShell/AppShellt';

export default function Home() {
  return (
    <AppShell>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Головна</h1>
              <p className={styles.subtitle}>
                Тут буде короткий огляд заявок, клієнтів та поточних задач.
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            <article className={styles.card}>
              <div className={styles.cardTitle}>Активні заявки</div>
              <div className={styles.cardValue}>—</div>
              <div className={styles.cardHint}>Поки що нема</div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardTitle}>Очікує погодження</div>
              <div className={styles.cardValue}>—</div>
              <div className={styles.cardHint}>Погодження вартості/робіт</div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardTitle}>Готово сьогодні</div>
              <div className={styles.cardValue}>—</div>
              <div className={styles.cardHint}>
                Пристрої для видачі клієнтам
              </div>
            </article>
          </div>

          <div className={styles.split}>
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.h2}>Останні заявки</h2>
                <span className={styles.badge}>Незабаром</span>
              </div>
              <div className={styles.empty}>Даних поки немає.</div>
            </article>

            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.h2}>Швидкі дії</h2>
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.actionBtn}>
                  Створити заявку
                </button>
                <button type="button" className={styles.actionBtnSecondary}>
                  Додати клієнта
                </button>
                <button type="button" className={styles.actionBtnSecondary}>
                  Додати пристрій
                </button>
              </div>

              <p className={styles.muted}>Кнопки — заглушки</p>
            </article>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
