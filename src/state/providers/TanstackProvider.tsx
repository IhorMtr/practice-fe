'use client';

import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

import { ApiConfigService } from '@/utils/services/ApiConfigService';

interface TanStackProviderProps {
  children: React.ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

const ReactQueryDevtools = isDev
  ? dynamic(
      () =>
        import('@tanstack/react-query-devtools').then(
          mod => mod.ReactQueryDevtools
        ),
      { ssr: false }
    )
  : () => null;

export default function TanStackProvider({ children }: TanStackProviderProps) {
  const [queryClient] = useState(() => {
    const showError = (error: unknown) => {
      const msg = ApiConfigService.getApiErrorMessage(error);
      toast.error(msg);
    };

    return new QueryClient({
      queryCache: new QueryCache({
        onError: error => showError(error),
      }),
      mutationCache: new MutationCache({
        onError: error => showError(error),
      }),
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
