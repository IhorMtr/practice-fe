'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './AppShell.module.scss';
import { useSidebar } from '@/hooks/componentHooks/useSidebar';

export default function AppShell({ children }: { children: ReactNode }) {
  const { navItems, activeHref, isLoggingOut, logoutErrorText, onLogout } =
    useSidebar();

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
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${
                      isActive ? styles.navLinkActive : ''
                    }`}
                  >
                    <span className={styles.navDot} />
                    <span className={styles.navLabel}>{item.label}</span>
                  </Link>
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

      <div className={styles.main}>{children}</div>
    </div>
  );
}
