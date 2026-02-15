'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useRefreshToken } from '@/hooks/requestHooks/useRefreshToken';
import { SILENT_REFRESH_INTERVAL_MS } from '@/constants/const';
import Preloader from '@/components/Preloader/Preloader';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { refreshToken } = useRefreshToken();

  const didInit = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const isAuthRoute = pathname === '/auth' || pathname.startsWith('/auth/');

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (isAuthRoute) {
      setIsReady(true);
      return;
    }

    (async () => {
      try {
        await refreshToken();
        setIsReady(true);
      } catch {
        router.replace('/auth/login');
      }
    })();
  }, [isAuthRoute, refreshToken, router]);

  useEffect(() => {
    if (!isReady) return;
    if (isAuthRoute) return;

    const id = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
        router.replace('/auth/login');
      }
    }, SILENT_REFRESH_INTERVAL_MS);

    return () => clearInterval(id);
  }, [isReady, isAuthRoute, refreshToken, router]);

  if (!isReady && !isAuthRoute) return <Preloader />;

  return <>{children}</>;
}
