import { NextResponse, type NextRequest } from 'next/server';

import type { RefreshTokenResponse } from '@/types/types/AuthTypes';
import { ApiConfigService } from '@/utils/services/ApiConfigService';

export async function POST(req: NextRequest) {
  try {
    const refreshTokenFromCookie = req.cookies.get('refreshToken')?.value;

    if (!refreshTokenFromCookie) {
      return NextResponse.json(
        { message: 'No refresh token' },
        { status: 401 }
      );
    }

    const backendRes = await ApiConfigService.api.post<RefreshTokenResponse>(
      '/auth/refresh',
      { refreshToken: refreshTokenFromCookie }
    );

    const payload = backendRes.data;

    if (!ApiConfigService.isSuccess(payload)) {
      return NextResponse.json(
        { message: payload.message ?? 'Refresh failed' },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = payload.data;

    const setCookiesUrl = `${req.nextUrl.origin}/api/auth/set-cookies`;

    const setCookieRes = await ApiConfigService.internalApi.post(
      setCookiesUrl,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const res = NextResponse.json({ accessToken });

    const setCookieHeader = setCookieRes.headers['set-cookie'];
    if (Array.isArray(setCookieHeader)) {
      for (const c of setCookieHeader) res.headers.append('set-cookie', c);
    } else if (typeof setCookieHeader === 'string') {
      res.headers.set('set-cookie', setCookieHeader);
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
