import type { TicketPriority, TicketStatus } from '@/types/types/TicketTypes';

export type GetTicketsRequest = {
  status?: TicketStatus;
  priority?: TicketPriority;
  clientId?: string;
  search?: string;
};

export type GetTicketByIdRequest = {
  ticketId: string;
};

export type CreateTicketRequest = {
  clientId: string;
  deviceType: string;
  problemDescription: string;
  priority?: TicketPriority;
};

export type UpdateTicketByManagerRequest = {
  ticketId: string;
  deviceType?: string;
  problemDescription?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assignedTechnicianId?: string | null;
  estimatedCost?: number | null;
  finalCost?: number | null;
};

export type UpdateTicketStatusRequest = {
  ticketId: string;
  status?: TicketStatus;
  comment?: string | null;
};
