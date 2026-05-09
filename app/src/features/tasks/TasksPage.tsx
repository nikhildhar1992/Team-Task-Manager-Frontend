import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { toApiError } from '../../lib/apiError';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { useAuth } from '../auth/useAuth';
import { useTeams } from '../team/hooks';
import { useCreateTaskMutation, useDeleteTaskMutation, useTasks, useUpdateTaskMutation } from './hooks';

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];
const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function TasksPage() {
  const { session } = useAuth();
  const teamsQuery = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState('');

  const selectedTeam = useMemo(() => {
    if (!teamsQuery.data || teamsQuery.data.length === 0) {
      return null;
    }
    if (selectedTeamId === null) {
      return teamsQuery.data[0];
    }
    return teamsQuery.data.find((team) => team.id === selectedTeamId) ?? teamsQuery.data[0];
  }, [teamsQuery.data, selectedTeamId]);

  const tasksQuery = useTasks(selectedTeam?.id ?? null);
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const createTaskError = useMemo(
    () => (createTaskMutation.error ? toApiError(createTaskMutation.error).message : null),
    [createTaskMutation.error],
  );

  function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !selectedTeam) {
      return;
    }
    const loginUserId = Number(session?.user?.id);

    createTaskMutation.mutate(
      {
        teamId: selectedTeam.id,
        title: title.trim(),
        description: description.trim() || undefined,
        assignedTo: Number.isFinite(loginUserId) ? loginUserId : undefined,
        status,
        priority,
        deadline: deadline || undefined,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setStatus('todo');
          setPriority('medium');
          setDeadline('');
        },
      },
    );
  }

  if (teamsQuery.isLoading) {
    return <LoadingState message="Loading teams..." />;
  }

  if (teamsQuery.error) {
    return <ErrorState error={teamsQuery.error} title="Could not load teams for tasks" />;
  }

  if (!selectedTeam) {
    return <EmptyState title="No team found" description="Join a team first to manage tasks." />;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Task Management</h2>
          <p className="mt-1 text-sm text-slate-600">
            Team-scoped tasks aligned with backend APIs.
          </p>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-slate-600">Team</span>
          <select
            value={selectedTeam.id}
            onChange={(event) => {
              setSelectedTeamId(Number(event.target.value));
            }}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            {teamsQuery.data?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Create Task</h3>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleCreateTask}>
          {createTaskError ? <p className="text-sm text-red-700 md:col-span-2">{createTaskError}</p> : null}
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
          <textarea
            className="rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-2"
            rows={3}
            placeholder="Task description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
          >
            {priorityOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Task List</h3>

        {tasksQuery.isLoading ? <LoadingState message="Loading tasks..." /> : null}
        {tasksQuery.error ? <ErrorState error={tasksQuery.error} title="Could not load tasks" /> : null}

        {tasksQuery.data && tasksQuery.data.items.length > 0 ? (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="px-2 py-2">Title</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Priority</th>
                    <th className="px-2 py-2">Assignee</th>
                    <th className="px-2 py-2">Due</th>
                    <th className="px-2 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasksQuery.data.items.map((task) => (
                    <tr key={task.id}>
                      <td className="px-2 py-2">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.description || 'No description'}</p>
                      </td>
                      <td className="px-2 py-2">
                        <div className="mb-2">
                          <StatusBadge status={task.status} />
                        </div>
                        <select
                          className="rounded-md border border-slate-300 px-2 py-1"
                          value={task.status}
                          onChange={(event) =>
                            updateTaskMutation.mutate({
                              teamId: selectedTeam.id,
                              taskId: task.id,
                              status: event.target.value as TaskStatus,
                            })
                          }
                        >
                          {statusOptions.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-slate-700">
                        {priorityOptions.find((option) => option.value === task.priority)?.label ?? task.priority}
                      </td>
                      <td className="px-2 py-2">
                        {task.assignedTo ? `User ${task.assignedTo}` : 'Unassigned'}
                      </td>
                      <td className="px-2 py-2 text-slate-700">{task.deadline || '-'}</td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          onClick={() => deleteTaskMutation.mutate({ teamId: selectedTeam.id, taskId: task.id })}
                          disabled={deleteTaskMutation.isPending}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tasksQuery.data && tasksQuery.data.items.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create your first task to get started." />
        ) : null}
      </section>
    </div>
  );
}
