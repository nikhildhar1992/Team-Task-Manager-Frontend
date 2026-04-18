import { FormEvent, useMemo, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { PaginationControls } from '../../components/common/PaginationControls';
import { toApiError } from '../../lib/apiError';
import type { TeamRole } from '../../types/team';
import {
  useCreateTeamMutation,
  useCurrentTeam,
  useInviteMemberMutation,
  useTeamMembers,
} from './hooks';

export function TeamPage() {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<TeamRole>('Member');
  const [memberPage, setMemberPage] = useState(1);

  const teamQuery = useCurrentTeam();
  const createTeamMutation = useCreateTeamMutation();
  const inviteMutation = useInviteMemberMutation();
  const membersQuery = useTeamMembers({ page: memberPage, pageSize: 5 }, Boolean(teamQuery.data));

  const createTeamError = useMemo(
    () => (createTeamMutation.error ? toApiError(createTeamMutation.error).message : null),
    [createTeamMutation.error],
  );

  const inviteError = useMemo(
    () => (inviteMutation.error ? toApiError(inviteMutation.error).message : null),
    [inviteMutation.error],
  );

  function handleCreateTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!teamName.trim()) {
      return;
    }

    createTeamMutation.mutate({ name: teamName.trim(), description: teamDescription.trim() || undefined });
  }

  function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      return;
    }

    inviteMutation.mutate(
      {
        name: memberName.trim(),
        email: memberEmail.trim(),
        role: memberRole,
      },
      {
        onSuccess: () => {
          setMemberName('');
          setMemberEmail('');
          setMemberRole('Member');
        },
      },
    );
  }

  if (teamQuery.isLoading) {
    return <LoadingState message="Loading team details..." />;
  }

  if (teamQuery.error) {
    return <ErrorState error={teamQuery.error} title="Could not load team" />;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Team Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Create your team, invite members, and manage roles.</p>
      </header>

      {!teamQuery.data ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">Create Team</h3>
          <p className="mt-1 text-sm text-slate-600">Start by creating a team workspace.</p>
          <form className="mt-4 grid gap-3" onSubmit={handleCreateTeam}>
            {createTeamError ? <p className="text-sm text-red-700">{createTeamError}</p> : null}
            <input
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Team name"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
            <textarea
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Team description (optional)"
              rows={3}
              value={teamDescription}
              onChange={(event) => setTeamDescription(event.target.value)}
            />
            <button
              type="submit"
              className="w-fit rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              disabled={createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-900">{teamQuery.data.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {teamQuery.data.description || 'No team description provided.'}
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">Invite Member</h3>
              <form className="mt-4 grid gap-3" onSubmit={handleInvite}>
                {inviteError ? <p className="text-sm text-red-700">{inviteError}</p> : null}
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Full name"
                  value={memberName}
                  onChange={(event) => setMemberName(event.target.value)}
                />
                <input
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Email"
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  type="email"
                />
                <select
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value as TeamRole)}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="w-fit rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? 'Inviting...' : 'Send Invite'}
                </button>
              </form>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">Members</h3>

              {membersQuery.isLoading ? <LoadingState message="Loading members..." /> : null}
              {membersQuery.error ? <ErrorState error={membersQuery.error} title="Could not load members" /> : null}

              {membersQuery.data && membersQuery.data.items.length > 0 ? (
                <>
                  <ul className="mt-4 divide-y divide-slate-200">
                    {membersQuery.data.items.map((member) => (
                      <li key={member.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.name}</p>
                          <p className="text-sm text-slate-500">{member.email}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {member.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <PaginationControls
                    page={membersQuery.data.page}
                    totalPages={membersQuery.data.totalPages}
                    onPageChange={setMemberPage}
                  />
                </>
              ) : null}

              {membersQuery.data && membersQuery.data.items.length === 0 ? (
                <EmptyState title="No team members yet" description="Invite teammates to collaborate." />
              ) : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
