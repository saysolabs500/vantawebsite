import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key')?.trim();
  const hwid = searchParams.get('hwid')?.trim();

  if (!key || !hwid) {
    return NextResponse.json({ valid: false });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ valid: false });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from('license_keys')
    .select('hwid, expires_at')
    .eq('key_value', key)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false });
  }

  if (data.hwid !== hwid) {
    return NextResponse.json({ valid: false });
  }

  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
