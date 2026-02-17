'use client';

import { useMutation } from '@tanstack/react-query';

import type { UpdateUserRequest } from '@/types/interfaces/UserInterfaces';
import type { UpdateUserResponse } from '@/types/types/UserTypes';
import type { BaseResponse } from '@/types/types/GlobalTypes';
import UserApiService from '@/utils/services/UserApiService';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export function useUpdateUser() {
  const query = useMutation<UpdateUserResponse, unknown, UpdateUserRequest>({
    mutationFn: payload => UserApiService.updateUser(payload),
  });

  const error: BaseResponse<null> | null = query.isError
    ? ApiConfigService.getApiErrorPayload(query.error)
    : null;

  const updateUser = (values: UpdateUserRequest) => query.mutateAsync(values);

  return { query, error, updateUser };
}
