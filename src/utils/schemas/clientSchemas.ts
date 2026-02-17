import * as yup from 'yup';

export const createClientSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Ім'я є обовʼязковим.")
    .min(2, "Ім'я занадто коротке."),
  email: yup
    .string()
    .trim()
    .lowercase()
    .required('Email є обовʼязковим.')
    .email('Некоректний email.'),
  notes: yup
    .string()
    .transform(v => (typeof v === 'string' ? v.trim() : v))
    .nullable()
    .default(null)
    .max(2000, 'Нотатки занадто довгі.'),
});

export const updateClientSchema = createClientSchema;
