'use client';

import { useMutation } from '@tanstack/react-query';

import TicketApiService from '@/utils/services/TicketApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { UpdateTicketStatusRequest } from '@/types/interfaces/TicketInterfaces';
import type { UpdateTicketStatusResponse } from '@/types/types/TicketTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';

export function useUpdateTicketStatus() {
  const query = useMutation<
    UpdateTicketStatusResponse,
    unknown,
    UpdateTicketStatusRequest
  >({
    mutationFn: payload => TicketApiService.updateTicketStatus(payload),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const updateTicketStatus = (values: UpdateTicketStatusRequest) =>
    query.mutateAsync(values);

  return { query, error, updateTicketStatus };
}
