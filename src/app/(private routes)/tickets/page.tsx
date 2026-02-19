'use client';

import TicketsTable from '@/components/TicketsTable/TicketsTable';
import styles from './page.module.scss';

export default function TicketsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Заявки</h1>
              <p className={styles.subtitle}>
                Список заявок на ремонт. Пошук за типом пристрою або описом.
              </p>
            </div>
          </div>
          <TicketsTable />
        </div>
      </section>
    </div>
  );
}
