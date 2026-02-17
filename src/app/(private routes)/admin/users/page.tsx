'use client';

import AdminUsersTable from '@/components/AdminUsersTable/AdminUsersTable';
import styles from './page.module.scss';

export default function AdminUsersPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Користувачі</h1>
              <p className={styles.subtitle}>
                Тут адміністратор може призначати ролі користувачам.
              </p>
            </div>
          </div>

          <AdminUsersTable />

          <div className={styles.note}>
            Зміни набудуть чинності одразу після збереження.
          </div>
        </div>
      </section>
    </div>
  );
}
