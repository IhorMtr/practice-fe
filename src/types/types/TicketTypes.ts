import type { BaseResponse } from './GlobalTypes';

// =============== ENUM-LIKE UNIONS =============

export const TICKET_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = [
  'new',
  'in_progress',
  'done',
  'cancelled',
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export type TicketHistoryAction =
  | 'created'
  | 'status_changed'
  | 'technician_assigned'
  | 'cost_updated'
  | 'comment';

// =============== COMMON SHAPES =============

export type IdNameEmail = { _id: string; name: string; email: string };
export type ClientShort = { _id: string; fullName: string; email: string };

// =============== API MODELS =============

export type ExpandedHistoryItem = {
  at: string;
  action: TicketHistoryAction;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  toTechnicianId?: string | null;
  comment?: string;
  actorId: string;
  actor: IdNameEmail | null;
};

export type Ticket = {
  _id: string;
  client: ClientShort | null;
  assignedTechnician: IdNameEmail | null;
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  estimatedCost: number | null;
  finalCost: number | null;
  history: ExpandedHistoryItem[];
  createdAt: string;
  updatedAt: string;
};

// =============== FORMS =============

export type CreateTicketFormValues = {
  clientId: string;
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
};

export type EditTicketFormValues = {
  deviceType: string;
  problemDescription: string;
  priority: TicketPriority;
  assignedTechnicianId: string;
  estimatedCost: string;
  finalCost: string;
  status: TicketStatus;
  statusComment: string;
};

// =============== RESPONSES =============

export type GetTicketsResponse = BaseResponse<Ticket[]>;
export type GetTicketByIdResponse = BaseResponse<Ticket>;
export type CreateTicketResponse = BaseResponse<Ticket>;
export type UpdateTicketByManagerResponse = BaseResponse<Ticket>;
export type UpdateTicketStatusResponse = BaseResponse<Ticket>;
