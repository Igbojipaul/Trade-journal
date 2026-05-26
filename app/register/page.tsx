'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '', email: '', password: '', password2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('ERR  PASSWORDS DO NOT MATCH');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register/', form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      router.push('/');
    } catch (err: any) {
      const data = err.response?.data;
      if (typeof data === 'object') {
        setError(`ERR  ${Object.values(data).flat().join(' ')}`);
      } else {
        setError('ERR  REGISTRATION FAILED');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #1e1e1e',
    color: '#e8e8e8',
    padding: '12px 14px',
    fontSize: '12px',
    fontFamily: 'Roboto Mono, monospace',
    letterSpacing: '1px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    color: '#333',
    fontSize: '9px',
    letterSpacing: '2px',
    marginBottom: '6px',
    display: 'block' as const,
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'repeating-linear-gradient(0deg, transparent, '
          + 'transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      <div style={{
        width: '100%', maxWidth: '400px',
        border: '1px solid #1e1e1e',
        background: '#0a0a0a',
        position: 'relative', zIndex: 1,
      }}>
        {/* Title bar */}
        <div style={{
          background: '#111', borderBottom: '1px solid #1e1e1e',
          padding: '10px 16px',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{
            color: '#00ff88', fontSize: '10px',
            letterSpacing: '3px', fontWeight: 700,
          }}>
            TJ TERMINAL
          </span>
          <span style={{ color: '#222', fontSize: '10px' }}>
            NEW ACCOUNT
          </span>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '6px',
            }}>
              CREATE ACCOUNT
            </div>
            <div style={{
              color: '#e8e8e8', fontSize: '18px',
              fontWeight: 700, letterSpacing: '3px',
            }}>
              REGISTER
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,59,59,0.08)',
              border: '1px solid rgba(255,59,59,0.3)',
              color: '#ff3b3b', padding: '10px 14px',
              fontSize: '11px', letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="username" style={labelStyle}>USERNAME</label>
              <input name="username" type="text" value={form.username}
                onChange={handleChange} style={inputStyle}
                placeholder="traderkng" required />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="email" style={labelStyle}>EMAIL</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} style={inputStyle}
                placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="password" style={labelStyle}>PASSWORD</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} style={inputStyle}
                placeholder="min. 8 characters" required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password2" style={labelStyle}>CONFIRM PASSWORD</label>
              <input name="password2" type="password" value={form.password2}
                onChange={handleChange} style={inputStyle}
                placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#111' : '#00ff88',
              color: loading ? '#333' : '#000',
              border: 'none', padding: '13px',
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '3px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Roboto Mono, monospace',
              marginBottom: '20px', transition: 'all 0.1s',
            }}>
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER '}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '12px', marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
            <span style={{ color: '#333', fontSize: '9px', letterSpacing: '2px' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
          </div>

          <GoogleLoginButton />

          <div style={{
            marginTop: '24px', paddingTop: '20px',
            borderTop: '1px solid #1a1a1a', textAlign: 'center',
          }}>
            <span style={{ color: '#333', fontSize: '10px' }}>
              HAVE AN ACCOUNT?{' '}
            </span>
            <Link href="/login" style={{
              color: '#00ff88', fontSize: '10px',
              letterSpacing: '1px', textDecoration: 'none',
            }}>
              LOGIN 
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}