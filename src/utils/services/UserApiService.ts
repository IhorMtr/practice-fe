import {
  GetUserByIdRequest,
  UpdateUserRequest,
} from '@/types/interfaces/UserInterfaces';
import {
  UpdateUserResponse,
  GetUsersResponse,
  GetUserByIdResponse,
  GetTechniciansResponse,
  GetMeResponse,
} from '@/types/types/UserTypes';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

const UserApiService = {
  async getUsers(): Promise<GetUsersResponse> {
    const res = await ApiConfigService.api.get<GetUsersResponse>('/users');
    return res.data;
  },

  async getUserById({
    userId,
  }: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const res = await ApiConfigService.api.get<GetUserByIdResponse>(
      `/users/${userId}`
    );
    return res.data;
  },

  async updateUser({
    userId,
    role,
    isActive,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const res = await ApiConfigService.api.patch<UpdateUserResponse>(
      `/users/${userId}`,
      { role, isActive }
    );
    return res.data;
  },

  async getTechnicians(): Promise<GetTechniciansResponse> {
    const res =
      await ApiConfigService.api.get<GetTechniciansResponse>(
        '/users/technicians'
      );
    return res.data;
  },

  async getMe(): Promise<GetMeResponse> {
    const res = await ApiConfigService.api.get<GetMeResponse>('/users/me');
    return res.data;
  },
};

export default UserApiService;
