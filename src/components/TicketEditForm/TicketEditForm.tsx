'use client';

import type { FormikHelpers } from 'formik';
import { Form, Formik } from 'formik';

import styles from './TicketEditForm.module.scss';
import {
  editTicketSchema,
  statusOnlySchema,
} from '@/utils/schemas/ticketSchemas';
import type { EditTicketFormValues } from '@/types/types/TicketTypes';

export type TechnicianOption = {
  value: string;
  label: string;
};

type Mode = 'full' | 'statusOnly';

interface Props {
  mode: Mode;
  initialValues: EditTicketFormValues;
  isSubmitting: boolean;
  technicianOptions?: TechnicianOption[];
  isTechniciansLoading?: boolean;
  onSubmit: (
    values: EditTicketFormValues,
    helpers: FormikHelpers<EditTicketFormValues>
  ) => void | Promise<void>;
  onCancel: () => void;
}

export default function TicketEditForm({
  mode,
  initialValues,
  isSubmitting,
  technicianOptions = [],
  isTechniciansLoading = false,
  onSubmit,
  onCancel,
}: Props) {
  const schema = mode === 'statusOnly' ? statusOnlySchema : editTicketSchema;

  return (
    <div className={styles.card}>
      <Formik<EditTicketFormValues>
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
        validateOnBlur
        validateOnChange={false}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          isSubmitting: formSubmitting,
          handleChange,
        }) => {
          const disabled = isSubmitting || formSubmitting;

          const showFull = mode === 'full';
          const showStatusOnly = mode === 'statusOnly';

          return (
            <Form className={styles.form}>
              <div className={styles.grid}>
                {showFull ? (
                  <>
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
                        disabled={disabled}
                      />
                      {touched.deviceType && errors.deviceType ? (
                        <div className={styles.fieldError}>
                          {errors.deviceType}
                        </div>
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
                        <div className={styles.fieldError}>
                          {errors.priority}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}

                <div className={styles.field}>
                  <label className={styles.label}>Статус *</label>
                  <select
                    name="status"
                    className={`${styles.select} ${
                      touched.status && errors.status ? styles.inputError : ''
                    }`}
                    value={values.status}
                    onChange={handleChange}
                    disabled={disabled}
                  >
                    <option value="new">Нова</option>
                    <option value="in_progress">В роботі</option>
                    <option value="done">Готово</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                  {touched.status && errors.status ? (
                    <div className={styles.fieldError}>
                      {errors.status as any}
                    </div>
                  ) : null}
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    Коментар {showStatusOnly ? '*' : '(необовʼязково)'}
                  </label>
                  <textarea
                    name="statusComment"
                    className={`${styles.textarea} ${
                      touched.statusComment && errors.statusComment
                        ? styles.inputError
                        : ''
                    }`}
                    value={values.statusComment}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="Додайте коментар до зміни статусу…"
                  />
                  {touched.statusComment && errors.statusComment ? (
                    <div className={styles.fieldError}>
                      {errors.statusComment as any}
                    </div>
                  ) : null}
                </div>

                {showFull ? (
                  <>
                    <div className={styles.field}>
                      <label className={styles.label}>Майстер</label>
                      <select
                        name="assignedTechnicianId"
                        className={styles.select}
                        value={values.assignedTechnicianId}
                        onChange={handleChange}
                        disabled={disabled || isTechniciansLoading}
                      >
                        <option value="">
                          {isTechniciansLoading
                            ? 'Завантаження…'
                            : 'Не призначено'}
                        </option>

                        {technicianOptions.map(o => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>
                        Орієнтовна вартість
                      </label>
                      <input
                        name="estimatedCost"
                        className={`${styles.input} ${
                          touched.estimatedCost && errors.estimatedCost
                            ? styles.inputError
                            : ''
                        }`}
                        value={values.estimatedCost}
                        onChange={handleChange}
                        placeholder="Напр., 1200"
                        disabled={disabled}
                      />
                      {touched.estimatedCost && errors.estimatedCost ? (
                        <div className={styles.fieldError}>
                          {errors.estimatedCost}
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Фінальна вартість</label>
                      <input
                        name="finalCost"
                        className={`${styles.input} ${
                          touched.finalCost && errors.finalCost
                            ? styles.inputError
                            : ''
                        }`}
                        value={values.finalCost}
                        onChange={handleChange}
                        placeholder="Напр., 1500"
                        disabled={disabled}
                      />
                      {touched.finalCost && errors.finalCost ? (
                        <div className={styles.fieldError}>
                          {errors.finalCost}
                        </div>
                      ) : null}
                    </div>

                    <div className={styles.fieldFull}>
                      <label className={styles.label}>Опис проблеми *</label>
                      <textarea
                        name="problemDescription"
                        className={`${styles.textarea} ${
                          touched.problemDescription &&
                          errors.problemDescription
                            ? styles.inputError
                            : ''
                        }`}
                        value={values.problemDescription}
                        onChange={handleChange}
                        disabled={disabled}
                      />
                      {touched.problemDescription &&
                      errors.problemDescription ? (
                        <div className={styles.fieldError}>
                          {errors.problemDescription}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={disabled ? styles.disabledBtn : styles.primaryBtn}
                  disabled={disabled}
                >
                  {disabled ? 'Збереження…' : 'Зберегти'}
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
