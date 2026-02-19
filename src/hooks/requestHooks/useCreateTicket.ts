'use client';

import { useMutation } from '@tanstack/react-query';

import TicketApiService from '@/utils/services/TicketApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { CreateTicketRequest } from '@/types/interfaces/TicketInterfaces';
import type { CreateTicketResponse } from '@/types/types/TicketTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';

export function useCreateTicket() {
  const query = useMutation<CreateTicketResponse, unknown, CreateTicketRequest>(
    {
      mutationFn: payload => TicketApiService.createTicket(payload),
    }
  );

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const createTicket = (values: CreateTicketRequest) =>
    query.mutateAsync(values);

  return { query, error, createTicket };
}
