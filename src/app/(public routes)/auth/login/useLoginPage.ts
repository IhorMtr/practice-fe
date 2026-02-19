'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import type { LoginRequest } from '@/types/interfaces/AuthInterfaces';
import { useLogin } from '@/hooks/requestHooks/useLogin';

export function useLoginPage() {
  const router = useRouter();
  const { query, login } = useLogin();

  const onSubmit = async (values: LoginRequest) => {
    try {
      await login(values);

      toast.success('Успішний вхід');

      router.replace('/');
      router.refresh();
    } catch {}
  };

  return {
    isLoading: query.isPending,
    onSubmit,
  };
}
