'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function Step2Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(' verifying...');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) {
      setStatus('Invalid. Complete the step from the beginning.');
      return;
    }
    fetch(`/api/verify-hash?hash=${encodeURIComponent(hash)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setOk(true);
          setStatus('1/2 checkpoints complete');
        } else {
          setStatus('Verification failed. Please try again.');
        }
      })
      .catch(() => setStatus('Verification failed.'));
  }, [searchParams]);

  const handleNext = () => {
    setLoading(true);
    window.location.href = `${window.location.origin}/api/redirect-linkvertise?step=2`;
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>{ok ? '1/2 Complete' : 'Verifying'}</h1>
      <p style={styles.sub}>{status}</p>
      {ok && (
        <button style={styles.btn} onClick={handleNext} disabled={loading}>
          {loading ? 'Redirecting...' : 'Next'}
        </button>
      )}
    </div>
  );
}

export default function Step2() {
  return (
    <Suspense fallback={<div style={styles.card}>Loading...</div>}>
      <Step2Content />
    </Suspense>
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
};
