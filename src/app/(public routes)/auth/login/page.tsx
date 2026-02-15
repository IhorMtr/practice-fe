'use client';

import Link from 'next/link';

import styles from './page.module.scss';
import { LoginForm } from '@/components/LoginForm/LoginForm';
import { useLoginPage } from './useLoginPage';

export default function LoginPage() {
  const { onSubmit, isLoading } = useLoginPage();

  return (
    <section className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>Вхід</h1>
            <p className={styles.subtitle}>
              Увійдіть у систему, щоб продовжити
            </p>
          </header>

          <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

          <p className={styles.switchText}>
            Немає акаунта?{' '}
            <Link href="/auth/register" className={styles.switchLink}>
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
