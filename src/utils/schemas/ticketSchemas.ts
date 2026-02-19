import * as yup from 'yup';

export const createTicketSchema = yup.object({
  clientId: yup.string().trim().required('Оберіть клієнта.'),
  deviceType: yup
    .string()
    .trim()
    .min(2, 'Мінімум 2 символи.')
    .max(64, 'Максимум 64 символи.')
    .required('Вкажіть тип пристрою.'),
  problemDescription: yup
    .string()
    .trim()
    .min(2, 'Мінімум 2 символи.')
    .max(2000, 'Максимум 2000 символів.')
    .required('Опишіть проблему.'),
  priority: yup.string().trim().required('Оберіть пріоритет.'),
});

export const editTicketSchema = yup.object({
  deviceType: yup.string().trim().min(2).max(64).required('Обовʼязкове поле'),
  problemDescription: yup
    .string()
    .trim()
    .min(2)
    .max(2000)
    .required('Обовʼязкове поле'),

  priority: yup
    .mixed<'low' | 'medium' | 'high'>()
    .oneOf(['low', 'medium', 'high'])
    .required('Обовʼязкове поле'),

  status: yup
    .mixed<'new' | 'in_progress' | 'done' | 'cancelled'>()
    .oneOf(['new', 'in_progress', 'done', 'cancelled'])
    .required('Обовʼязкове поле'),

  statusComment: yup
    .string()
    .trim()
    .notRequired()
    .max(500, 'Макс. 500 символів'),

  assignedTechnicianId: yup.string().trim(),

  estimatedCost: yup
    .string()
    .trim()
    .matches(/^\d+(\.\d+)?$|^$/, 'Введіть число або залиште порожнім'),
  finalCost: yup
    .string()
    .trim()
    .matches(/^\d+(\.\d+)?$|^$/, 'Введіть число або залиште порожнім'),
});

export const statusOnlySchema = yup.object({
  status: yup
    .mixed<'new' | 'in_progress' | 'done' | 'cancelled'>()
    .oneOf(['new', 'in_progress', 'done', 'cancelled'])
    .required('Обовʼязкове поле'),

  statusComment: yup
    .string()
    .trim()
    .min(2, 'Мін. 2 символи')
    .max(500, 'Макс. 500 символів')
    .notRequired(),
});
