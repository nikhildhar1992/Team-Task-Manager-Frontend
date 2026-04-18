import { FormEvent, useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { PaginationControls } from '../../components/common/PaginationControls';
import { StatusBadge } from '../../components/common/StatusBadge';
import { toApiError } from '../../lib/apiError';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { useTeamMembers } from '../team/hooks';
import {
  useAssignTaskMutation,
  useCreateTaskMutation,
  useTasks,
  useUpdateTaskStatusMutation,
} from './hooks';

const statusOptions: TaskStatus[] = ['Todo', 'In Progress', 'Done'];
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

export function TasksPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Todo');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueDate, setDueDate] = useState('');

  const tasksQuery = useTasks({
    page,
    pageSize: 8,
    status: statusFilter === 'All' ? undefined : statusFilter,
  });
  const membersQuery = useTeamMembers({ page: 1, pageSize: 100 });

  const createTaskMutation = useCreateTaskMutation();
  const assignTaskMutation = useAssignTaskMutation();
  const updateStatusMutation = useUpdateTaskStatusMutation();

  const createTaskError = useMemo(
    () => (createTaskMutation.error ? toApiError(createTaskMutation.error).message : null),
    [createTaskMutation.error],
  );

  function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    createTaskMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId: assigneeId || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setAssigneeId('');
          setStatus('Todo');
          setPriority('Medium');
          setDueDate('');
          setPage(1);
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Task Management</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create tasks, assign owners, and track progress with status updates.
          </p>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-slate-600">Filter status</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as TaskStatus | 'All');
              setPage(1);
            }}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="All">All</option>
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
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
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
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
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
          >
            <option value="">Unassigned</option>
            {membersQuery.data?.items.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
          >
            {priorityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
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
                            updateStatusMutation.mutate({
                              taskId: task.id,
                              status: event.target.value as TaskStatus,
                            })
                          }
                        >
                          {statusOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-slate-700">{task.priority}</td>
                      <td className="px-2 py-2">
                        <select
                          className="rounded-md border border-slate-300 px-2 py-1"
                          value={task.assigneeId ?? ''}
                          onChange={(event) =>
                            assignTaskMutation.mutate({
                              taskId: task.id,
                              assigneeId: event.target.value || undefined,
                            })
                          }
                        >
                          <option value="">Unassigned</option>
                          {membersQuery.data?.items.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 text-slate-700">{task.dueDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              page={tasksQuery.data.page}
              totalPages={tasksQuery.data.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}

        {tasksQuery.data && tasksQuery.data.items.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create your first task to get started." />
        ) : null}
      </section>
    </div>
  );
}
