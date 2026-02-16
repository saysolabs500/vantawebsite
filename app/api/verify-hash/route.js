import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hashRaw = searchParams.get('hash');
  const hash = typeof hashRaw === 'string' ? hashRaw.trim() : '';
  const debug = searchParams.get('debug') === '1';

  const TOKEN = (process.env.LINKVERTISE_TOKEN || '').trim();

  if (!TOKEN) {
    return NextResponse.json(debug ? { valid: false, error: 'LINKVERTISE_TOKEN not configured' } : { valid: false });
  }
  if (!hash) {
    return NextResponse.json(debug ? { valid: false, error: 'No hash in URL (ensure Linkvertise target is exact step2 URL, Anti-Bypass enabled)' } : { valid: false });
  }
  if (hash.length < 60 || hash.length > 70) {
    return NextResponse.json(debug ? { valid: false, error: `Hash length ${hash.length} (expected 64)` } : { valid: false });
  }

  try {
    const url = `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${encodeURIComponent(TOKEN)}&hash=${encodeURIComponent(hash)}`;
    const res = await fetch(url, { method: 'POST' });
    const text = (await res.text()).trim();
    const valid = text.toUpperCase() === 'TRUE';

    if (debug) {
      const errMsg = text === 'FALSE' ? 'Hash not found or expired (10s window, complete ad fully)' : text.startsWith('Invalid') ? 'Invalid token - check LINKVERTISE_TOKEN in Vercel' : valid ? null : text;
      return NextResponse.json({ valid, error: errMsg, lvResponse: text });
    }
    return NextResponse.json({ valid });
  } catch (e) {
    return NextResponse.json(debug ? { valid: false, error: String(e?.message || e) } : { valid: false });
  }
}
