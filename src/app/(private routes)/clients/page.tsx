'use client';

import ClientsTable from '@/components/ClientsTable/ClientsTable';
import styles from './page.module.scss';

export default function ClientsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Клієнти</h1>
              <p className={styles.subtitle}>
                Список клієнтів компанії. Можна шукати за імʼям або email.
              </p>
            </div>
          </div>

          <ClientsTable />
        </div>
      </section>
    </div>
  );
}
