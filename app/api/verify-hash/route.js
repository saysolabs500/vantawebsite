import { NextResponse } from 'next/server';

const TOKEN = process.env.LINKVERTISE_TOKEN || '';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');

  if (!hash || typeof hash !== 'string' || hash.length !== 64 || !TOKEN) {
    return NextResponse.json({ valid: false });
  }

  try {
    const res = await fetch(
      `https://publisher.linkvertise.com/api/v1/anti_bypassing?token=${encodeURIComponent(TOKEN)}&hash=${encodeURIComponent(hash)}`,
      { method: 'POST' }
    );
    const text = await res.text();
    const valid = text.trim().toUpperCase() === 'TRUE';
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
