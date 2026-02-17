'use client';

import { useCallback } from 'react';
import type { FormikHelpers } from 'formik';

import styles from './page.module.scss';
import { useCreateClientPage } from './useCreateClientPage';
import CreateClientForm from '@/components/CreateClientForm.tsx/CreateClientForm';
import { CreateClientFormValues } from '@/types/types/ClientTypes';

// =============== PAGE =============
export default function CreateClientPage() {
  const { initialValues, isSubmitting, onBack, onCancel, onSubmit } =
    useCreateClientPage();

  // =============== FORM BRIDGE =============
  const handleSubmit = useCallback(
    async (
      values: CreateClientFormValues,
      helpers: FormikHelpers<CreateClientFormValues>
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
              <h1 className={styles.h1}>Новий клієнт</h1>
              <p className={styles.subtitle}>
                Заповніть дані клієнта для створення картки.
              </p>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onBack}
              disabled={isSubmitting}
            >
              Назад
            </button>
          </div>

          <div className={styles.card}>
            <CreateClientForm
              initialValues={initialValues}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={onCancel}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
