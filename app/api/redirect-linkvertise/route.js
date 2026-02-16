import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const LINK_1 = process.env.LINKVERTISE_LINK_1 || 'https://linkvertise.com/1216137';
const LINK_2 = process.env.LINKVERTISE_LINK_2 || process.env.LINKVERTISE_LINK_1 || 'https://linkvertise.com/1216137';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const step = searchParams.get('step');
  let hwid = searchParams.get('hwid') || '';

  const cookieStore = await cookies();
  if (!hwid && step === '2') {
    hwid = cookieStore.get('vanta_hwid')?.value || '';
  }

  if (!hwid || hwid.length < 8) {
    return NextResponse.redirect((SITE || request.nextUrl.origin) + '/');
  }

  cookieStore.set('vanta_hwid', hwid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30,
    path: '/',
  });

  const dest = step === '1' ? LINK_1 : LINK_2;
  return NextResponse.redirect(dest);
}
