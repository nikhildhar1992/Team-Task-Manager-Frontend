import { isRateLimitError, toApiError } from '../../lib/apiError';

interface ErrorStateProps {
  error: unknown;
  title?: string;
}

export function ErrorState({ error, title = 'Something went wrong' }: ErrorStateProps) {
  const apiError = toApiError(error);

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{apiError.message}</p>
      {isRateLimitError(error) ? (
        <p className="mt-2 text-xs">You have sent too many requests. Try again in a moment.</p>
      ) : null}
    </div>
  );
}
