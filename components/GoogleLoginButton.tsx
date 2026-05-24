'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function GoogleLoginButton() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');

    if (!credentialResponse.credential) {
      setError('No credential received from Google.');
      return;
    }

    try {
      const res = await api.post('/auth/google/', {
        credential: credentialResponse.credential,
      });

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      router.push('/');
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(msg || 'Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError('Google login was cancelled or failed.')}
        theme="filled_black"
        shape="rectangular"
        width="200"
        text="continue_with"
      />
    </div>
  );
}