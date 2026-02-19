import type {
  TicketHistoryAction,
  TicketPriority,
  TicketStatus,
} from '@/types/types/TicketTypes';

export const STATUS_LABEL: Record<TicketStatus, string> = {
  new: 'Нова',
  in_progress: 'В роботі',
  done: 'Готово',
  cancelled: 'Скасовано',
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const HISTORY_ACTION_LABEL: Record<TicketHistoryAction, string> = {
  created: 'Створено',
  status_changed: 'Зміна статусу',
  technician_assigned: 'Призначено майстра',
  cost_updated: 'Оновлено вартість',
  comment: 'Коментар',
};

export const EMPTY = '—';

export function statusText(value: unknown) {
  const s = String(value ?? '').trim() as TicketStatus;
  return STATUS_LABEL[s] ?? (s || EMPTY);
}

export function priorityText(value: unknown) {
  const p = String(value ?? '').trim() as TicketPriority;
  return PRIORITY_LABEL[p] ?? (p || EMPTY);
}

export function actorLabel(h: any) {
  const a = h?.actor;
  if (a?.name && a?.email) return `${a.name} (${a.email})`;
  if (a?.name) return a.name;
  return h?.actorId || EMPTY;
}

export function getHistoryActionLabel(action: unknown) {
  return (
    HISTORY_ACTION_LABEL[action as TicketHistoryAction] ??
    (action ? String(action) : EMPTY)
  );
}

export function getHistoryDetails(h: any) {
  switch (h?.action) {
    case 'status_changed':
      return `${statusText(h.fromStatus)} → ${statusText(h.toStatus)}`;

    case 'technician_assigned':
      return h.toTechnicianId
        ? `Призначено майстра: ${h.toTechnicianId}`
        : 'Знято призначення майстра';

    default: {
      const c = h?.comment?.trim();
      return c ? c : EMPTY;
    }
  }
}
