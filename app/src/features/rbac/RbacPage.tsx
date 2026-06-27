import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { toApiError } from '../../lib/apiError';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { useAuth } from '../auth/useAuth';
import { useCreateTeamMutation, useDeleteTeamMutation, useTeamDetail, useTeams } from '../team/hooks';
import { useCreateTaskMutation, useDeleteTaskMutation, useTasks, useUpdateTaskMutation } from '../tasks/hooks';

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

function formatDueDate(deadline?: string | null) {
  if (!deadline) {
    return '-';
  }

  const [year, month, day] = deadline.slice(0, 10).split('-');
  if (!year || !month || !day) {
    return deadline;
  }

  return `${month}-${day}-${year}`;
}

export function RbacPage() {
  const { session } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [deadline, setDeadline] = useState('');

  const teamsQuery = useTeams();
  const createTeamMutation = useCreateTeamMutation();
  const deleteTeamMutation = useDeleteTeamMutation();
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const selectedTeam = useMemo(() => {
    if (!teamsQuery.data || teamsQuery.data.length === 0) {
      return null;
    }
    if (selectedTeamId === null) {
      return teamsQuery.data[0];
    }
    return teamsQuery.data.find((team) => team.id === selectedTeamId) ?? teamsQuery.data[0];
  }, [teamsQuery.data, selectedTeamId]);

  const teamDetailQuery = useTeamDetail(selectedTeam?.id ?? null);
  const tasksQuery = useTasks(selectedTeam?.id ?? null);

  const createTeamError = useMemo(
    () => (createTeamMutation.error ? toApiError(createTeamMutation.error).message : null),
    [createTeamMutation.error],
  );
  const deleteTeamError = useMemo(
    () => (deleteTeamMutation.error ? toApiError(deleteTeamMutation.error).message : null),
    [deleteTeamMutation.error],
  );
  const createTaskError = useMemo(
    () => (createTaskMutation.error ? toApiError(createTaskMutation.error).message : null),
    [createTaskMutation.error],
  );

  function handleCreateTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTeamName.trim()) {
      return;
    }

    createTeamMutation.mutate(
      { name: newTeamName.trim() },
      {
        onSuccess: (team) => {
          setNewTeamName('');
          setSelectedTeamId(team.id);
        },
      },
    );
  }

  function handleDeleteTeam() {
    if (!selectedTeam) {
      return;
    }
    deleteTeamMutation.mutate(selectedTeam.id, {
      onSuccess: () => {
        setSelectedTeamId(null);
      },
    });
  }

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
    return <LoadingState message="Loading RBAC workspace..." />;
  }

  if (teamsQuery.error) {
    return <ErrorState error={teamsQuery.error} title="Could not load teams" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">RBAC</h2>
          <p className="mt-1 text-sm text-slate-600">Manage teams and team-scoped tasks from one place.</p>
        </div>

        {selectedTeam ? (
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Active Team</span>
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
        ) : null}
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Create Team</h3>
        <form className="mt-4 flex flex-wrap items-center gap-3" onSubmit={handleCreateTeam}>
          {createTeamError ? <p className="w-full text-sm text-red-700">{createTeamError}</p> : null}
          <input
            className="w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Team name"
            value={newTeamName}
            onChange={(event) => setNewTeamName(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={createTeamMutation.isPending}
          >
            {createTeamMutation.isPending ? 'Saving...' : 'Save Team'}
          </button>
        </form>
      </section>

      {!selectedTeam ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <EmptyState title="No teams found" description="Create a team above to manage its tasks." />
        </section>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-1">
              <h3 className="text-base font-semibold text-slate-900">Teams</h3>
              <ul className="mt-4 space-y-2">
                {teamsQuery.data?.map((team) => {
                  const isSelected = selectedTeam.id === team.id;
                  return (
                    <li key={team.id}>
                      <button
                        type="button"
                        className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        <p className="font-medium">{team.name}</p>
                        <p className={`text-xs ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>ID: {team.id}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-900">Team Details</h3>
              <div className="mt-3 text-sm text-slate-700">
                {teamDetailQuery.error ? (
                  <p className="mb-2 text-sm text-red-700">{toApiError(teamDetailQuery.error).message}</p>
                ) : null}
                <p>
                  <span className="font-medium">Name:</span> {teamDetailQuery.data?.name ?? selectedTeam.name}
                </p>
                <p className="mt-1">
                  <span className="font-medium">Team ID:</span> {selectedTeam.id}
                </p>
                {teamDetailQuery.data?.createdAt ? (
                  <p className="mt-1">
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(teamDetailQuery.data.createdAt).toLocaleDateString()}
                  </p>
                ) : null}
                {deleteTeamError ? <p className="mt-3 text-sm text-red-700">{deleteTeamError}</p> : null}
                <button
                  type="button"
                  className="mt-4 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
                  onClick={handleDeleteTeam}
                  disabled={deleteTeamMutation.isPending}
                >
                  {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete Team'}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-900">Create Task</h3>
            <p className="mt-1 text-sm text-slate-600">New tasks will be created under {selectedTeam.name}.</p>
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
            <h3 className="text-base font-semibold text-slate-900">Tasks for {selectedTeam.name}</h3>

            {tasksQuery.isLoading ? <LoadingState message="Loading tasks..." /> : null}
            {tasksQuery.error ? <ErrorState error={tasksQuery.error} title="Could not load tasks" /> : null}

            {tasksQuery.data && tasksQuery.data.items.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="px-2 py-2">Title</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Priority</th>
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
                        <td className="px-2 py-2 text-slate-700">{formatDueDate(task.deadline)}</td>
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
            ) : null}

            {tasksQuery.data && tasksQuery.data.items.length === 0 ? (
              <EmptyState title="No tasks yet" description="Create your first task for this team." />
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
