// =================== Global Types ===================

export type BaseResponse<T> = {
  data: T | null;
  success: boolean;
  errors?: Record<string, string[]> | null;
  message: string | null;
};

// =================== Common Types ===================

export type Role = 'admin' | 'manager' | 'technician' | null;

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
};
