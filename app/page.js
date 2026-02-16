'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();
  const hwid = searchParams.get('hwid') || '';
  const [loading, setLoading] = useState(false);

  const handleGetKey = () => {
    if (!hwid || hwid.length < 8) {
      alert('Invalid session. Please open this page from the VANTA launcher.');
      return;
    }
    setLoading(true);
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    window.location.href = `${base}/api/redirect-linkvertise?step=1&hwid=${encodeURIComponent(hwid)}`;
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>VANTA Key</h1>
      <p style={styles.sub}>Complete the steps to receive your license key</p>
      <button style={styles.btn} onClick={handleGetKey} disabled={loading}>
        {loading ? 'Redirecting...' : 'Get Key'}
      </button>
      {!hwid && (
        <p style={styles.warn}>Open this page from the VANTA launcher (Get Key button)</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(13, 13, 21, 0.9)',
    border: '1px solid rgba(157, 78, 221, 0.3)',
    borderRadius: 12,
    padding: 40,
    textAlign: 'center',
    maxWidth: 420,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  title: { fontSize: 24, fontWeight: 700, color: '#E0AAFF', marginBottom: 8 },
  sub: { fontSize: 14, color: '#888', marginBottom: 24 },
  btn: {
    background: 'linear-gradient(135deg, #9D4EDD, #7c3aed)',
    color: '#fff',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  warn: { marginTop: 20, fontSize: 12, color: '#e07a7a' },
};

export default function Home() {
  return (
    <Suspense fallback={<div style={styles.card}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
