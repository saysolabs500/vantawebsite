'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function Step3Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Verifying...');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) {
      setError('Invalid. Complete the step from the beginning.');
      return;
    }
    fetch(`/api/verify-hash?hash=${encodeURIComponent(hash)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          return fetch('/api/generate-key', { method: 'POST' });
        }
        setError('Verification failed. Please try again.');
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.key) {
          setKey(data.key);
          setStatus('Your key (valid 12 hours, this device only):');
        } else if (!error) {
          setError('Could not generate key. Try again.');
        }
      })
      .catch(() => setError('An error occurred.'));
  }, [searchParams]);

  const copyKey = () => {
    if (key) navigator.clipboard.writeText(key);
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>{key ? 'Key Ready' : error ? 'Error' : 'Verifying'}</h1>
      <p style={styles.sub}>{error || status}</p>
      {key && (
        <>
          <div style={styles.keyBox} onClick={copyKey}>
            <code style={styles.key}>{key}</code>
          </div>
          <p style={styles.hint}>Click to copy. Paste into VANTA launcher.</p>
        </>
      )}
    </div>
  );
}

export default function Step3() {
  return (
    <Suspense fallback={<div style={styles.card}>Loading...</div>}>
      <Step3Content />
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
  keyBox: {
    background: 'rgba(26, 13, 46, 0.8)',
    border: '1px solid #9D4EDD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    cursor: 'pointer',
    fontFamily: 'monospace',
  },
  key: { fontSize: 14, color: '#C77DFF', wordBreak: 'break-all' },
  hint: { fontSize: 12, color: '#666' },
};
