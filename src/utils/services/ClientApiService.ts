import type {
  CreateClientRequest,
  GetClientByIdRequest,
  UpdateClientRequest,
} from '@/types/interfaces/ClientInterfaces';

import type {
  CreateClientResponse,
  GetClientByIdResponse,
  GetClientsResponse,
  UpdateClientResponse,
} from '@/types/types/ClientTypes';

import { ApiConfigService } from '@/utils/services/ApiConfigService';

const ClientApiService = {
  async getClients(search?: string): Promise<GetClientsResponse> {
    const res = await ApiConfigService.api.get<GetClientsResponse>('/clients', {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  async getClientById({
    clientId,
  }: GetClientByIdRequest): Promise<GetClientByIdResponse> {
    const res = await ApiConfigService.api.get<GetClientByIdResponse>(
      `/clients/${clientId}`
    );
    return res.data;
  },

  async createClient(
    payload: CreateClientRequest
  ): Promise<CreateClientResponse> {
    const res = await ApiConfigService.api.post<CreateClientResponse>(
      '/clients',
      payload
    );
    return res.data;
  },

  async updateClient({
    clientId,
    ...payload
  }: UpdateClientRequest): Promise<UpdateClientResponse> {
    const res = await ApiConfigService.api.patch<UpdateClientResponse>(
      `/clients/${clientId}`,
      payload
    );
    return res.data;
  },
};

export default ClientApiService;
