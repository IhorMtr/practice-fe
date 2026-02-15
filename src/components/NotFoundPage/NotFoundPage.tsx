import Link from 'next/link';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.card}>
            <div className={styles.top}>
              <div className={styles.badge}>Помилка</div>
              <div className={styles.code}>404</div>
              <h1 className={styles.title}>Сторінку не знайдено</h1>
              <p className={styles.text}>
                Схоже, ви перейшли за неправильним посиланням або сторінка була
                переміщена.
              </p>
            </div>

            <div className={styles.actions}>
              <Link href="/" className={styles.primaryBtn}>
                На головну
              </Link>
              <Link href="/requests" className={styles.secondaryBtn}>
                До заявок
              </Link>
            </div>

            <div className={styles.links}>
              <div className={styles.linksTitle}>Швидкі переходи</div>
              <div className={styles.linksGrid}>
                <Link href="/clients" className={styles.linkCard}>
                  <div className={styles.linkTitle}>Клієнти</div>
                  <div className={styles.linkHint}>Перегляд та редагування</div>
                </Link>

                <Link href="/devices" className={styles.linkCard}>
                  <div className={styles.linkTitle}>Пристрої</div>
                  <div className={styles.linkHint}>Облік техніки</div>
                </Link>

                <Link href="/technicians" className={styles.linkCard}>
                  <div className={styles.linkTitle}>Майстри</div>
                  <div className={styles.linkHint}>
                    Виконавці та завантаженість
                  </div>
                </Link>

                <Link href="/settings" className={styles.linkCard}>
                  <div className={styles.linkTitle}>Налаштування</div>
                  <div className={styles.linkHint}>Параметри системи</div>
                </Link>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.tip}>
                Порада: перевірте адресу в рядку браузера або поверніться на
                головну.
              </div>
            </div>

            <div className={styles.decor} />
          </div>
        </div>
      </section>
    </div>
  );
}
