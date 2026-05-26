'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login/', credentials);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      router.push('/');
    } catch {
      setError('ERR // INVALID CREDENTIALS');
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

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>

      {/* Scanline effect */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, '
          + 'transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #1e1e1e',
        background: '#0a0a0a',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Terminal title bar */}
        <div style={{
          background: '#111',
          borderBottom: '1px solid #1e1e1e',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            color: '#00ff88',
            fontSize: '10px',
            letterSpacing: '3px',
            fontWeight: 700,
          }}>
            TJ// TERMINAL
          </span>
          <span style={{ color: '#222', fontSize: '10px' }}>
            AUTH MODULE v1.0
          </span>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{
            marginBottom: '28px',
          }}>
            <div style={{
              color: '#333',
              fontSize: '9px',
              letterSpacing: '3px',
              marginBottom: '6px',
            }}>
              SYSTEM LOGIN
            </div>
            <div style={{
              color: '#e8e8e8',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '3px',
            }}>
              AUTHENTICATE
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,59,59,0.08)',
              border: '1px solid rgba(255,59,59,0.3)',
              color: '#ff3b3b',
              padding: '10px 14px',
              fontSize: '11px',
              letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                color: '#333',
                fontSize: '9px',
                letterSpacing: '2px',
                marginBottom: '6px',
              }}>
                USERNAME
              </div>
              <input
                type="text"
                value={credentials.username}
                onChange={e => setCredentials(p =>
                  ({ ...p, username: e.target.value }))}
                style={inputStyle}
                placeholder="enter username"
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                color: '#333',
                fontSize: '9px',
                letterSpacing: '2px',
                marginBottom: '6px',
              }}>
                PASSWORD
              </div>
              <input
                type="password"
                value={credentials.password}
                onChange={e => setCredentials(p =>
                  ({ ...p, password: e.target.value }))}
                style={inputStyle}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? '#111' : '#00ff88',
              color: loading ? '#333' : '#000',
              border: 'none',
              padding: '13px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '3px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Roboto Mono, monospace',
              marginBottom: '20px',
              transition: 'all 0.1s',
            }}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>

          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
            <span style={{
              color: '#333',
              fontSize: '9px',
              letterSpacing: '2px',
            }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
          </div>

          <GoogleLoginButton />

          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #1a1a1a',
            textAlign: 'center',
          }}>
            <span style={{ color: '#333', fontSize: '10px' }}>
              NO ACCOUNT?{'  '}
            </span>
            <Link href="/register" style={{
              color: '#00ff88',
              fontSize: '10px',
              letterSpacing: '1px',
              textDecoration: 'none',
            }}>
              REGISTER 
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}