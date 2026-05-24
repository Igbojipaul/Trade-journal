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
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register/', form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      router.push('/');
    } catch (err: any) {
      const data = err.response?.data;
      // Django returns errors as objects — flatten them
      if (typeof data === 'object') {
        const messages = Object.values(data).flat().join(' ');
        setError(messages);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
    text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
    transition-colors`;

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full
                      max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 bg-blue-800 rounded-lg flex items-center
                          justify-center text-white font-bold text-sm">
            TJ
          </div>
          <span className="font-bold text-white text-lg">TradeJournal</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
        <p className="text-gray-400 text-sm mb-8">
          Start tracking your trades today
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">




          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider
                               mb-1 block">
              Username
            </label>
            <input name="username" type="text" value={form.username}
              onChange={handleChange} placeholder="traderkng"
              className={inputClass} required />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider
                               mb-1 block">
              Email
            </label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              className={inputClass} required />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider
                               mb-1 block">
              Password
            </label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="••••••••"
              className={inputClass} required />
            <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider
                               mb-1 block">
              Confirm Password
            </label>
            <input name="password2" type="password" value={form.password2}
              onChange={handleChange} placeholder="••••••••"
              className={inputClass} required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-500 disabled:bg-blue-800/50
                       text-white font-semibold rounded-lg py-3 transition-colors mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
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
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300
                                         transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}