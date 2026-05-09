import { Link } from 'react-router-dom';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { useCurrentTeam, useTeamMembers } from '../team/hooks';
import { useTasks } from '../tasks/hooks';

export function DashboardPage() {
  const teamQuery = useCurrentTeam();
  const membersQuery = useTeamMembers({ page: 1, pageSize: 1 });
  const tasksQuery = useTasks({ page: 1, pageSize: 100 });

  const taskSummary = (tasksQuery.data?.items ?? []).reduce(
    (summary, task) => {
      if (task.status === 'Done') {
        summary.done += 1;
      } else if (task.status === 'In Progress') {
        summary.inProgress += 1;
      } else {
        summary.todo += 1;
      }
      return summary;
    },
    { todo: 0, inProgress: 0, done: 0 },
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back. Here is a quick view of your team and task workspace.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Team</p>
          {teamQuery.isLoading ? (
            <p className="mt-2 text-sm text-slate-700">Loading...</p>
          ) : (
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {teamQuery.data?.name ?? 'No team yet'}
            </p>
          )}
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Members</p>
          {membersQuery.isLoading ? (
            <p className="mt-2 text-sm text-slate-700">Loading...</p>
          ) : (
            <p className="mt-2 text-lg font-semibold text-slate-900">{membersQuery.data?.total ?? 0}</p>
          )}
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{taskSummary.inProgress}</p>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Done</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{taskSummary.done}</p>
        </article>
      </section>

      {teamQuery.error ? <ErrorState error={teamQuery.error} title="Could not load team summary" /> : null}
      {tasksQuery.error ? <ErrorState error={tasksQuery.error} title="Could not load task summary" /> : null}
      {membersQuery.error ? (
        <ErrorState error={membersQuery.error} title="Could not load member summary" />
      ) : null}

      {teamQuery.isLoading || tasksQuery.isLoading || membersQuery.isLoading ? (
        <LoadingState message="Loading dashboard overview..." />
      ) : null}

      {!tasksQuery.isLoading && tasksQuery.data && tasksQuery.data.items.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task from the Tasks page to see progress on the dashboard."
        />
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            to="/tasks"
          >
            Create or manage tasks
          </Link>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            to="/teams"
          >
            Manage team
          </Link>
          <Link
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            to="/ai-assistant"
          >
            Use AI assistant
          </Link>
        </div>
      </section>
    </div>
  );
}
