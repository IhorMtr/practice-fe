import { ApiConfigService } from '@/utils/services/ApiConfigService';

import type {
  GetTicketsResponse,
  GetTicketByIdResponse,
  CreateTicketResponse,
  UpdateTicketByManagerResponse,
  UpdateTicketStatusResponse,
} from '@/types/types/TicketTypes';

import type {
  GetTicketsRequest,
  GetTicketByIdRequest,
  CreateTicketRequest,
  UpdateTicketByManagerRequest,
  UpdateTicketStatusRequest,
} from '@/types/interfaces/TicketInterfaces';

const TicketApiService = {
  async getTickets(params: GetTicketsRequest): Promise<GetTicketsResponse> {
    const res = await ApiConfigService.api.get<GetTicketsResponse>('/tickets', {
      params,
    });
    return res.data;
  },

  async getTicketById({
    ticketId,
  }: GetTicketByIdRequest): Promise<GetTicketByIdResponse> {
    const res = await ApiConfigService.api.get<GetTicketByIdResponse>(
      `/tickets/${ticketId}`
    );
    return res.data;
  },

  async createTicket(
    payload: CreateTicketRequest
  ): Promise<CreateTicketResponse> {
    const res = await ApiConfigService.api.post<CreateTicketResponse>(
      '/tickets',
      payload
    );
    return res.data;
  },

  async updateTicketByManager({
    ticketId,
    ...payload
  }: UpdateTicketByManagerRequest): Promise<UpdateTicketByManagerResponse> {
    const res = await ApiConfigService.api.patch<UpdateTicketByManagerResponse>(
      `/tickets/${ticketId}`,
      payload
    );
    return res.data;
  },

  async updateTicketStatus({
    ticketId,
    ...payload
  }: UpdateTicketStatusRequest): Promise<UpdateTicketStatusResponse> {
    const res = await ApiConfigService.api.patch<UpdateTicketStatusResponse>(
      `/tickets/${ticketId}/status`,
      payload
    );
    return res.data;
  },
};

export default TicketApiService;
