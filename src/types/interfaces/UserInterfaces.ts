import { UserRole } from '../types/GlobalTypes';

export interface UpdateUserRequest {
  userId: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface GetUserByIdRequest {
  userId: string;
}
