import { EMPTY } from './ticketLabels';

export function formatDate(value?: string | Date) {
  if (!value) return EMPTY;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('uk-UA');
}
