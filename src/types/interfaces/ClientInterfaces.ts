export interface CreateClientRequest {
  fullName: string;
  email: string;
  notes?: string | null;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  clientId: string;
}

export interface GetClientByIdRequest {
  clientId: string;
}
