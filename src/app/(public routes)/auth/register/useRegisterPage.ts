'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import type { RegisterRequest } from '@/types/interfaces/AuthInterfaces';
import { useRegister } from '@/hooks/requestHooks/useRegister';

export function useRegisterPage() {
  const router = useRouter();
  const { query, register } = useRegister();

  const onSubmit = async (values: RegisterRequest) => {
    try {
      const res = await register(values);

      toast.success(res?.message ?? 'Користувача створено');

      router.replace('/auth/login');
    } catch {}
  };

  return {
    isLoading: query.isPending,
    onSubmit,
  };
}
