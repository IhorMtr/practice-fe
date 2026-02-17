import { BaseResponse } from './GlobalTypes';
import { User } from './GlobalTypes';

export type GetUsersResponse = BaseResponse<User[]>;
export type UpdateUserResponse = BaseResponse<User>;
export type GetUserByIdResponse = BaseResponse<User>;
