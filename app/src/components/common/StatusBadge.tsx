import type { TaskStatus } from '../../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass =
    status === 'Done'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'In Progress'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>{status}</span>;
}
