import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './hooks';
import { useAuth } from './useAuth';
import { toApiError } from '../../lib/apiError';
import { AuthShell } from './AuthShell';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const loginMutation = useLoginMutation();
  const { applySession, notice, clearNotice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const errorMessage = useMemo(() => {
    if (!loginMutation.error) {
      return null;
    }
    return toApiError(loginMutation.error).message;
  }, [loginMutation.error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setValidationMessage('Email and password are required.');
      return;
    }

    setValidationMessage(null);
    clearNotice();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (session) => {
          applySession(session);
          const destination = (location.state as { from?: string } | null)?.from ?? '/tasks';
          navigate(destination, { replace: true });
        },
      },
    );
  }

  return (
    <AuthShell title="Login" subtitle="Access your task workspace from login page.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {notice ? <p className="rounded-md bg-amber-50 p-2 text-sm text-amber-700">{notice}</p> : null}
        {validationMessage ? (
          <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{validationMessage}</p>
        ) : null}
        {errorMessage ? <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{errorMessage}</p> : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="you@company.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        New here?{' '}
        <Link className="font-medium text-slate-900 underline" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
