'use client';

import { useGetMe } from '@/hooks/requestHooks/useGetMe';
import type { User } from '@/types/types/GlobalTypes';
import { formatDate } from '@/utils/helpers/formatDate';

// =============== HELPERS =============

export function useMePage() {
  const { query, refetchMe } = useGetMe();

  // =============== DATA =============

  const me: User | null =
    query.data?.success === true ? (query.data.data as User) : null;

  const createdAtText = formatDate(me?.createdAt);
  const updatedAtText = formatDate(me?.updatedAt);

  // =============== ACTIONS =============

  const onRetry = () => {
    refetchMe();
  };

  return {
    me,
    isLoading: query.isPending,
    createdAtText,
    updatedAtText,
    onRetry,
  };
}
