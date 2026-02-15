import { REFRESH_TOKEN_MAX_AGE } from '@/constants/const';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = (await req.json()) as { refreshToken?: string };

    if (!refreshToken) {
      return NextResponse.json({ message: 'No token' }, { status: 401 });
    }

    const isProd = process.env.NODE_ENV === 'production';

    const res = NextResponse.json({ success: true });

    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return res;
  } catch {
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
