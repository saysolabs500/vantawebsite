import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

function randomKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 24; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s.match(/.{1,4}/g)?.join('-') || s;
}

export async function POST() {
  const cookieStore = await cookies();
  const hwid = cookieStore.get('vanta_hwid')?.value;

  if (!hwid || hwid.length < 8) {
    return NextResponse.json({ error: 'No session' }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const keyValue = randomKey();
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('license_keys').insert({
    key_value: keyValue,
    hwid,
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
  }

  cookieStore.delete('vanta_hwid');
  return NextResponse.json({ key: keyValue });
}
