import type { TaskStatus } from '../../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass =
    status === 'done'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'in_progress'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';

  const label = status === 'in_progress' ? 'In Progress' : status === 'done' ? 'Done' : 'Todo';
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>{label}</span>;
}
