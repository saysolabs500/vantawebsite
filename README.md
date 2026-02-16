# VANTA Key System (Vercel)

Deploy to Vercel for the key generation flow.

## Setup

1. **Supabase** – Run `supabase_license_keys.sql` in your Supabase SQL Editor. Get your **service_role** key from Project Settings → API.

2. **Linkvertise** – Create 2 Target-Links in your Linkvertise dashboard (Settings → Anti-Bypass: enable and copy your token):
   - **Link 1** target: `https://YOUR_VERCEL_URL.vercel.app/step2`
   - **Link 2** target: `https://YOUR_VERCEL_URL.vercel.app/step3`
   - Enable Anti-Bypass in Linkvertise settings.
   - Copy your Anti-Bypass token (64 chars).

3. **Vercel env** – Add these in Project Settings → Environment Variables:
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. https://vanta-key.vercel.app)
   - `LINKVERTISE_TOKEN` = your 64-char anti-bypass token
   - `LINKVERTISE_LINK_1` = full URL to Linkvertise link 1
   - `LINKVERTISE_LINK_2` = full URL to Linkvertise link 2
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_KEY` = Supabase service_role key (not anon)

4. **Launcher** – Update `KeySystemHelper.KeyWebsiteUrl` to your Vercel URL.
   - Or use the `VANTA_KEY_URL` config (see launcher).

## Flow

1. User clicks "Get Key" in launcher → opens `?hwid=XXX`
2. User clicks "Get Key" on site → redirect to Linkvertise 1
3. After Linkvertise 1 → `/step2?hash=XXX` → verify hash → "1/2 complete"
4. User clicks "Next" → redirect to Linkvertise 2
5. After Linkvertise 2 → `/step3?hash=XXX` → verify hash → generate key
6. Key is bound to HWID, valid 12 hours.
