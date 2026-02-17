import type { BaseResponse } from '@/types/types/GlobalTypes';

export type Client = {
  _id: string;
  fullName: string;
  email: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientEditFormValues = {
  fullName: string;
  email: string;
  notes: string;
};

export type CreateClientFormValues = {
  fullName: string;
  email: string;
  notes: string;
};

export type GetClientsResponse = BaseResponse<Client[]>;
export type CreateClientResponse = BaseResponse<Client>;
export type GetClientByIdResponse = BaseResponse<Client>;
export type UpdateClientResponse = BaseResponse<Client>;
