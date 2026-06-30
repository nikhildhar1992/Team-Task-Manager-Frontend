interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
      {message}
    </div>
  );
}
