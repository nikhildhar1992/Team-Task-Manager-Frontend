import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from './hooks';
import { useAuth } from './useAuth';
import { toApiError } from '../../lib/apiError';
import { AuthShell } from './AuthShell';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const signupMutation = useSignupMutation();
  const { applySession } = useAuth();
  const navigate = useNavigate();

  const errorMessage = useMemo(() => {
    if (!signupMutation.error) {
      return null;
    }
    return toApiError(signupMutation.error).message;
  }, [signupMutation.error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !email || !password) {
      setValidationMessage('Name, email, and password are required.');
      return;
    }

    if (password.length < 8) {
      setValidationMessage('Password must be at least 8 characters.');
      return;
    }

    setValidationMessage(null);

    signupMutation.mutate(
      { name, email, password },
      {
        onSuccess: (session) => {
          applySession(session);
          navigate('/dashboard', { replace: true });
        },
      },
    );
  }

  return (
    <AuthShell title="Create account" subtitle="Set up your team task manager workspace.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {validationMessage ? (
          <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{validationMessage}</p>
        ) : null}
        {errorMessage ? <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{errorMessage}</p> : null}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Taylor Smith"
          />
        </label>

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
            placeholder="Minimum 8 characters"
          />
        </label>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-slate-900 underline" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
