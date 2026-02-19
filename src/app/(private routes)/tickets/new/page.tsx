'use client';

import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import styles from './page.module.scss';
import { useCreateTicketPage } from './useCreateTicketPage';
import TicketCreateForm from '@/components/TicketCreateForm/TicketCreateForm';
import type { CreateTicketFormValues } from '@/types/types/TicketTypes';

export default function CreateTicketPage() {
  const {
    initialValues,
    isSubmitting,
    clientSearch,
    clientOptions,
    isClientsLoading,
    setClientSearch,
    onBack,
    onCancel,
    onSubmit,
  } = useCreateTicketPage();

  const handleSubmit = useCallback(
    async (
      values: CreateTicketFormValues,
      helpers: FormikHelpers<CreateTicketFormValues>
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
              <h1 className={styles.h1}>Нова заявка</h1>
              <p className={styles.subtitle}>
                Заповніть дані для створення заявки на ремонт.
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

          <TicketCreateForm
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            clientSearch={clientSearch}
            onClientSearchChange={setClientSearch}
            clientOptions={clientOptions}
            isClientsLoading={isClientsLoading}
            onSubmit={handleSubmit}
            onCancel={onCancel}
          />
        </div>
      </section>
    </div>
  );
}
