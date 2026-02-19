'use client';

import { useQuery } from '@tanstack/react-query';

import TicketApiService from '@/utils/services/TicketApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { GetTicketByIdResponse } from '@/types/types/TicketTypes';

export function useGetTicketById(ticketId: string) {
  const query = useQuery<GetTicketByIdResponse, unknown>({
    queryKey: ['ticket', ticketId],
    queryFn: () => TicketApiService.getTicketById({ ticketId }),
    enabled: Boolean(ticketId),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  return { query, error };
}
