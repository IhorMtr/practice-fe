import { BaseResponse, User } from './GlobalTypes';

// =================== Common Types ===================

export type AuthTokensData = {
  accessToken: string;
  refreshToken: string;
};

// =================== Responses ===================

export type LoginResponse = BaseResponse<AuthTokensData>;
export type RegisterResponse = BaseResponse<User>;
export type RefreshTokenResponse = BaseResponse<AuthTokensData>;
export type LogoutResponse = BaseResponse<null>;
