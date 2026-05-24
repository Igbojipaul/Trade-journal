'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import GoogleLoginButton from '@/components/GoogleLoginButton';
export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.SyntheticEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await api.post('/auth/login/', credentials);

    // Store both tokens
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);

    router.push('/');
  } catch (err: any) {
    setError('Invalid username or password.');
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Trade Journal</h1>
        <p className="text-gray-400 mb-8 text-sm">Sign in to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor='username' className="text-gray-400 text-sm mb-1 block">Username</label>
            <input
              type="text"
              id='username'
              name='username'
              value={credentials.username}
              onChange={e => setCredentials(p => ({ ...p, username: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                         text-white placeholder-gray-500 focus:outline-none
                         focus:border-blue-500 transition-colors"
              placeholder="your username"
              required
            />
          </div>

          <div>
            <label htmlFor='password' className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              name='password'
              value={credentials.password}
              onChange={e => setCredentials(p => ({ ...p, password: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                         text-white placeholder-gray-500 focus:outline-none
                         focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50
                       text-white font-semibold rounded-lg py-3 transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
           <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gray-900 text-gray-500">
                or
              </span>
            </div>
          </div>

          <GoogleLoginButton />

        </form>
         <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300
                                         transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}