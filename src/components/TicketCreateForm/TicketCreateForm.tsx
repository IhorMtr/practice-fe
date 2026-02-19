'use client';

import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';

import styles from './TicketCreateForm.module.scss';
import { createTicketSchema } from '@/utils/schemas/ticketSchemas';
import type { CreateTicketFormValues } from '@/types/types/TicketTypes';
import ClientPickerField, {
  type ClientPickerOption,
} from '@/components/ClientPickerField/ClientPickerField';

interface TicketCreateFormProps {
  initialValues: CreateTicketFormValues;
  isSubmitting: boolean;
  clientSearch: string;
  clientOptions: ClientPickerOption[];
  isClientsLoading: boolean;
  onClientSearchChange: (v: string) => void;
  onSubmit: (
    values: CreateTicketFormValues,
    helpers: FormikHelpers<CreateTicketFormValues>
  ) => void | Promise<void>;
  onCancel: () => void;
}

export default function TicketCreateForm({
  initialValues,
  isSubmitting,
  clientSearch,
  clientOptions,
  isClientsLoading,
  onClientSearchChange,
  onSubmit,
  onCancel,
}: TicketCreateFormProps) {
  return (
    <div className={styles.card}>
      <Formik<CreateTicketFormValues>
        initialValues={initialValues}
        validationSchema={createTicketSchema}
        onSubmit={onSubmit}
        validateOnBlur
        validateOnChange={false}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          isSubmitting: formSubmitting,
        }) => {
          const disabled = isSubmitting || formSubmitting;

          return (
            <Form className={styles.form}>
              <div className={styles.grid}>
                <div className={styles.fieldFull}>
                  <ClientPickerField
                    label="Клієнт *"
                    value={values.clientId}
                    onChange={id => setFieldValue('clientId', id)}
                    search={clientSearch}
                    onSearchChange={onClientSearchChange}
                    options={clientOptions}
                    isLoading={isClientsLoading}
                    disabled={disabled}
                    touched={Boolean(touched.clientId)}
                    errorText={errors.clientId || null}
                    onTouched={() => setFieldTouched('clientId', true, false)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Тип пристрою *</label>
                  <input
                    name="deviceType"
                    className={`${styles.input} ${
                      touched.deviceType && errors.deviceType
                        ? styles.inputError
                        : ''
                    }`}
                    value={values.deviceType}
                    onChange={handleChange}
                    placeholder="Напр., ноутбук / смартфон"
                    disabled={disabled}
                  />
                  {touched.deviceType && errors.deviceType ? (
                    <div className={styles.fieldError}>{errors.deviceType}</div>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Пріоритет *</label>
                  <select
                    name="priority"
                    className={`${styles.select} ${
                      touched.priority && errors.priority
                        ? styles.inputError
                        : ''
                    }`}
                    value={values.priority}
                    onChange={handleChange}
                    disabled={disabled}
                  >
                    <option value="low">Низький</option>
                    <option value="medium">Середній</option>
                    <option value="high">Високий</option>
                  </select>
                  {touched.priority && errors.priority ? (
                    <div className={styles.fieldError}>{errors.priority}</div>
                  ) : null}
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>Опис проблеми *</label>
                  <textarea
                    name="problemDescription"
                    className={`${styles.textarea} ${
                      touched.problemDescription && errors.problemDescription
                        ? styles.inputError
                        : ''
                    }`}
                    value={values.problemDescription}
                    onChange={handleChange}
                    placeholder="Опишіть проблему…"
                    disabled={disabled}
                  />
                  {touched.problemDescription && errors.problemDescription ? (
                    <div className={styles.fieldError}>
                      {errors.problemDescription}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={disabled ? styles.disabledBtn : styles.primaryBtn}
                  disabled={disabled}
                >
                  {disabled ? 'Створення…' : 'Створити'}
                </button>

                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={onCancel}
                  disabled={disabled}
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
