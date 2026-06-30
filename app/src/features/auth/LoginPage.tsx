import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './hooks';
import { useAuth } from './useAuth';
import { ProjectDemoVideo } from './ProjectDemoVideo';
import { getLoginValidationMessage } from './validation.js';
import { toApiError } from '../../lib/apiError';

const LOGIN_EMAIL = 'Nikhildhar92@gmail.com';

export function LoginPage() {
  const email = LOGIN_EMAIL;
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

    const nextValidationMessage = getLoginValidationMessage(email, password);
    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage);
      return;
    }

    setValidationMessage(null);
    clearNotice();
    const normalizedEmail = email.trim().toLowerCase();

    loginMutation.mutate(
      { email: normalizedEmail, password },
      {
        onSuccess: (session) => {
          applySession(session);
          const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';
          navigate(destination, { replace: true });
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-600">Access the portfolio workspace.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                readOnly
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
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
            <a className="font-medium text-slate-900 underline" href="mailto:Nikhildhar92@gmail.com">
              Create an account (Not Authorised)
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 lg:min-h-screen lg:border-l lg:border-t-0">
        <ProjectDemoVideo />
      </div>
    </div>
  );
}
