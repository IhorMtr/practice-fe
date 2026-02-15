'use client';

import { Formik } from 'formik';

import styles from './RegisterForm.module.scss';
import type { RegisterFormValues } from '@/types/interfaces/AuthInterfaces';
import { registerValidationSchema } from '@/utils/schemas/authSchemas';

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) {
  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidationSchema}
      validateOnBlur
      validateOnChange
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        isValid,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => {
        const hasError = (field: keyof RegisterFormValues) =>
          Boolean(touched[field] && errors[field]);

        return (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Ім’я
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ваше ім’я"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${hasError('name') ? styles.inputError : ''}`}
              />
              {hasError('name') && (
                <div className={styles.error}>{errors.name}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Електронна пошта
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${hasError('email') ? styles.inputError : ''}`}
              />
              {hasError('email') && (
                <div className={styles.error}>{errors.email}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${
                  hasError('password') ? styles.inputError : ''
                }`}
              />
              {hasError('password') && (
                <div className={styles.error}>{errors.password}</div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Підтвердження пароля
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${
                  hasError('confirmPassword') ? styles.inputError : ''
                }`}
              />
              {hasError('confirmPassword') && (
                <div className={styles.error}>{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting || isLoading || !dirty || !isValid}
            >
              Зареєструватися
            </button>
          </form>
        );
      }}
    </Formik>
  );
}
