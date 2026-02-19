'use client';

import { useQuery } from '@tanstack/react-query';

import TicketApiService from '@/utils/services/TicketApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import type { GetTicketsResponse } from '@/types/types/TicketTypes';
import type { GetTicketsRequest } from '@/types/interfaces/TicketInterfaces';

export function useGetTickets(params: GetTicketsRequest) {
  const query = useQuery<GetTicketsResponse, unknown>({
    queryKey: ['tickets', params],
    queryFn: () => TicketApiService.getTickets(params),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const refetchTickets = () => query.refetch();

  return { query, error, refetchTickets };
}
