'use client';

import { Form, Formik, type FormikHelpers } from 'formik';

import styles from './ClientEditForm.module.scss';

import { updateClientSchema } from '@/utils/schemas/clientSchemas';
import { ClientEditFormValues } from '@/types/types/ClientTypes';

interface ClientEditFormProps {
  initialValues: ClientEditFormValues;
  isSubmitting: boolean;
  onSubmit: (
    values: ClientEditFormValues,
    helpers: FormikHelpers<ClientEditFormValues>
  ) => void | Promise<void>;
  onCancel: () => void;
}

export default function ClientEditForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: ClientEditFormProps) {
  return (
    <div className={styles.card}>
      <Formik<ClientEditFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={updateClientSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched, isValid }) => {
          const canSubmit = isValid && !isSubmitting;

          return (
            <Form className={styles.form}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>Імʼя *</label>
                  <input
                    name="fullName"
                    className={`${styles.input} ${
                      touched.fullName && errors.fullName
                        ? styles.inputError
                        : ''
                    }`}
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                  />
                  {touched.fullName && errors.fullName ? (
                    <div className={styles.fieldError}>{errors.fullName}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email *</label>
                  <input
                    name="email"
                    className={`${styles.input} ${
                      touched.email && errors.email ? styles.inputError : ''
                    }`}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.fieldError}>{errors.email}</div>
                  ) : null}
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>Нотатки</label>
                  <textarea
                    name="notes"
                    className={`${styles.textarea} ${
                      touched.notes && errors.notes ? styles.inputError : ''
                    }`}
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                  />
                  {touched.notes && errors.notes ? (
                    <div className={styles.fieldError}>{errors.notes}</div>
                  ) : null}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={canSubmit ? styles.primaryBtn : styles.disabledBtn}
                  disabled={!canSubmit}
                >
                  {isSubmitting ? 'Збереження…' : 'Зберегти'}
                </button>

                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Скасувати
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
