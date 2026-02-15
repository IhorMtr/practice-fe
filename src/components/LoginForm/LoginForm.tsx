'use client';

import { Formik } from 'formik';

import styles from './LoginForm.module.scss';
import { LoginFormValues } from '@/types/interfaces/AuthInterfaces';
import { loginValidationSchema } from '@/utils/schemas/authSchemas';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const initialValues: LoginFormValues = { email: '', password: '' };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
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
        const emailError = Boolean(touched.email && errors.email);
        const passwordError = Boolean(touched.password && errors.password);

        return (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                className={`${styles.input} ${emailError ? styles.inputError : ''}`}
              />

              {emailError && (
                <div id="email-error" className={styles.error}>
                  {errors.email}
                </div>
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
                autoComplete="current-password"
                placeholder="••••••••"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${styles.input} ${
                  passwordError ? styles.inputError : ''
                }`}
              />

              {passwordError && (
                <div id="password-error" className={styles.error}>
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting || isLoading || !dirty || !isValid}
            >
              Увійти
            </button>
          </form>
        );
      }}
    </Formik>
  );
}
