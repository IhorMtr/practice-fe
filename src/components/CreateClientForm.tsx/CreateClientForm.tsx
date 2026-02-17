'use client';

import { Form, Formik, type FormikHelpers } from 'formik';

import styles from './CreateClientForm.module.scss';
import { createClientSchema } from '@/utils/schemas/clientSchemas';
import { CreateClientFormValues } from '@/types/types/ClientTypes';

// =============== TYPES =============
interface CreateClientFormProps {
  initialValues: CreateClientFormValues;
  isSubmitting: boolean;
  onSubmit: (
    values: CreateClientFormValues,
    helpers: FormikHelpers<CreateClientFormValues>
  ) => void | Promise<void>;
  onCancel: () => void;
}

// =============== COMPONENT =============
export default function CreateClientForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateClientFormProps) {
  return (
    <Formik<CreateClientFormValues>
      initialValues={initialValues}
      validationSchema={createClientSchema}
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
                    touched.fullName && errors.fullName ? styles.inputError : ''
                  }`}
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Напр., Іван Петренко"
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
                  placeholder="name@example.com"
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
                  placeholder="Додаткова інформація..."
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
                {isSubmitting ? 'Створення…' : 'Створити'}
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
  );
}
