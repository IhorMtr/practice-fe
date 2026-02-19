'use client';

import type { FormikHelpers } from 'formik';
import { useCallback } from 'react';

import styles from './page.module.scss';
import { useEditTicketPage } from './useEditTicketPage';
import Rbac from '@/components/Rbac/Rbac';
import TicketEditForm from '@/components/TicketEditForm/TicketEditForm';
import type { EditTicketFormValues } from '@/types/types/TicketTypes';

export default function EditTicketPage() {
  const {
    query,
    ticket,
    errorText,
    initialValues,
    technicianOptions,
    isTechniciansLoading,
    isSaving,
    onBack,
    onCancel,
    onSubmitFull,
    onSubmitStatus,
  } = useEditTicketPage();

  const handleSubmitFull = useCallback(
    async (
      values: EditTicketFormValues,
      helpers: FormikHelpers<EditTicketFormValues>
    ) => {
      await onSubmitFull(values);
      helpers.setSubmitting(false);
    },
    [onSubmitFull]
  );

  const handleSubmitStatus = useCallback(
    async (
      values: EditTicketFormValues,
      helpers: FormikHelpers<EditTicketFormValues>
    ) => {
      await onSubmitStatus(values);
      helpers.setSubmitting(false);
    },
    [onSubmitStatus]
  );

  return (
    <Rbac allow={['admin', 'manager', 'technician']} fallback={null}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={`container ${styles.container}`}>
            <div className={styles.header}>
              <div>
                <h1 className={styles.h1}>Редагування заявки</h1>
                <p className={styles.subtitle}>
                  Оновіть дані та збережіть зміни.
                </p>
              </div>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onBack}
                disabled={query.isFetching || isSaving}
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
                  {errorText || 'Не вдалося завантажити заявку.'}
                </div>
              </div>
            ) : !ticket ? (
              <div className={styles.card}>
                <div className={styles.empty}>Заявку не знайдено.</div>
              </div>
            ) : (
              <>
                <Rbac allow={['admin', 'manager']} fallback={null}>
                  <TicketEditForm
                    mode="full"
                    initialValues={initialValues}
                    isSubmitting={isSaving}
                    onSubmit={handleSubmitFull}
                    onCancel={onCancel}
                    technicianOptions={technicianOptions}
                    isTechniciansLoading={isTechniciansLoading}
                  />
                </Rbac>

                <Rbac allow={['technician']} fallback={null}>
                  <TicketEditForm
                    mode="statusOnly"
                    initialValues={initialValues}
                    isSubmitting={isSaving}
                    onSubmit={handleSubmitStatus}
                    onCancel={onCancel}
                  />
                </Rbac>
              </>
            )}
          </div>
        </section>
      </div>
    </Rbac>
  );
}
