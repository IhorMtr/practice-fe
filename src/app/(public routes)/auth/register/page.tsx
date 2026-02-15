'use client';

import Link from 'next/link';

import styles from './page.module.scss';
import { RegisterForm } from '@/components/RegisterForm/RegisterForm';
import { useRegisterPage } from './useRegisterPage';

export default function RegisterPage() {
  const { onSubmit, isLoading } = useRegisterPage();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Реєстрація</h1>
            <p className={styles.subtitle}>
              Створіть обліковий запис, щоб продовжити
            </p>
          </header>

          <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />

          <p className={styles.switchText}>
            Уже маєте акаунт?{' '}
            <Link href="/auth/login" className={styles.switchLink}>
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
