'use client';

import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import styles from './page.module.scss';
import { useEditClientPage } from './useEditClientPage';
import ClientEditForm from '@/components/ClientEditForm/ClientEditForm';
import { ClientEditFormValues } from '@/types/types/ClientTypes';

export default function EditClientPage() {
  const {
    query,
    updateQuery,
    client,
    errorText,
    initialValues,
    onBack,
    onCancel,
    onSubmit,
  } = useEditClientPage();

  const handleSubmit = useCallback(
    async (
      values: ClientEditFormValues,
      helpers: FormikHelpers<ClientEditFormValues>
    ) => {
      await onSubmit(values);
      helpers.setSubmitting(false);
    },
    [onSubmit]
  );

  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.h1}>Редагування клієнта</h1>
              <p className={styles.subtitle}>
                Оновіть дані клієнта та збережіть зміни.
              </p>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onBack}
              disabled={query.isFetching || updateQuery.isPending}
            >
              Назад
            </button>
          </div>

          {query.isLoading ? (
            <div className={styles.card}>
              <div className={styles.empty}>Завантаження…</div>
            </div>
          ) : query.isError ? (
            <div className={styles.card}>
              <div className={styles.empty}>
                {errorText || 'Не вдалося завантажити клієнта.'}
              </div>
            </div>
          ) : !client ? (
            <div className={styles.card}>
              <div className={styles.empty}>Клієнта не знайдено.</div>
            </div>
          ) : (
            <ClientEditForm
              initialValues={initialValues}
              isSubmitting={updateQuery.isPending}
              onSubmit={handleSubmit}
              onCancel={onCancel}
            />
          )}
        </div>
      </section>
    </div>
  );
}
