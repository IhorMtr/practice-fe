import { create } from 'zustand';

import type { UserRole } from '@/types/types/GlobalTypes';
import { decodeJwtPayload } from '@/utils/helpers/decodeJwtPayload';

export type JwtClaims = {
  userId: string;
  role: UserRole;
  iat: number;
  exp: number;
};

type ClaimsState = {
  token: string | null;
  claims: JwtClaims | null;

  setToken: (token: string | null) => void;
  clear: () => void;

  isExpired: () => boolean;
  hasRole: (roles?: Exclude<UserRole, null>[]) => boolean;
};

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  token: null,
  claims: null,

  setToken: (token: string | null) => {
    if (!token) {
      set({ token: null, claims: null });
      return;
    }

    const payload = decodeJwtPayload<JwtClaims>(token);
    if (!payload?.userId) {
      set({ token, claims: null });
      return;
    }

    set({ token, claims: payload });
  },

  clear: () => set({ token: null, claims: null }),

  isExpired: () => {
    const c = get().claims;
    if (!c?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= c.exp;
  },

  hasRole: (roles?: Exclude<UserRole, null>[]) => {
    if (!roles || roles.length === 0) return true;
    const role = get().claims?.role ?? null;
    if (!role) return false;
    return roles.includes(role as Exclude<UserRole, null>);
  },
}));
