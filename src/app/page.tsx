'use client';

import styles from './page.module.scss';
import { useHomePage } from './useHomePage';

export default function Home() {
  const { navItems, activeHref, isLoggingOut, logoutErrorText, onLogout } =
    useHomePage();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo} />
          <div className={styles.brandText}>
            <div className={styles.brandTitle}>Service Desk</div>
            <div className={styles.brandSubtitle}>Внутрішня система</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map(item => {
              const isActive = item.href === activeHref;

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.navLink} ${
                      isActive ? styles.navLinkActive : ''
                    }`}
                  >
                    <span className={styles.navDot} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          {logoutErrorText ? (
            <div className={styles.error}>{logoutErrorText}</div>
          ) : null}

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Вихід…' : 'Вийти'}
          </button>
        </div>
      </aside>

      <div className={styles.main}>
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
    </div>
  );
}
