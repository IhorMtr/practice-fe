// =================== Global Types ===================

export type BaseResponse<T> = {
  data: T | null;
  success: boolean;
  errors?: Record<string, string[]> | null;
  message: string | null;
};

// =================== Common Types ===================

export type UserRole = 'admin' | 'manager' | 'technician' | null;

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type RoleKey = Exclude<UserRole, null>;
