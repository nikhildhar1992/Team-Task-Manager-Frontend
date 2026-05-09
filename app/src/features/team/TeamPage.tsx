import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { toApiError } from '../../lib/apiError';
import { useCreateTeamMutation, useDeleteTeamMutation, useTeamDetail, useTeams } from './hooks';

export function TeamPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [newTeamName, setNewTeamName] = useState('');

  const teamsQuery = useTeams();
  const createTeamMutation = useCreateTeamMutation();
  const deleteTeamMutation = useDeleteTeamMutation();

  const createTeamError = useMemo(
    () => (createTeamMutation.error ? toApiError(createTeamMutation.error).message : null),
    [createTeamMutation.error],
  );
  const deleteTeamError = useMemo(
    () => (deleteTeamMutation.error ? toApiError(deleteTeamMutation.error).message : null),
    [deleteTeamMutation.error],
  );

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

  if (teamsQuery.isLoading) {
    return <LoadingState message="Loading your teams..." />;
  }

  if (teamsQuery.error) {
    return <ErrorState error={teamsQuery.error} title="Could not load teams" />;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Team Management</h2>
        <p className="mt-1 text-sm text-slate-600">Create teams, view list/details, and delete teams.</p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Add Team</h3>
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

      {!teamsQuery.data || teamsQuery.data.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <EmptyState title="No teams found" description="Create a team using the form above." />
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-1">
            <h3 className="text-base font-semibold text-slate-900">Team List</h3>
            <ul className="mt-4 space-y-2">
              {teamsQuery.data.map((team) => {
                const isSelected = selectedTeam?.id === team.id;
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

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">Team Details</h3>
              {selectedTeam ? (
                <div className="mt-3 text-sm text-slate-700">
                  {teamDetailQuery.error ? (
                    <p className="mb-2 text-sm text-red-700">
                      {toApiError(teamDetailQuery.error).message}
                    </p>
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
              ) : (
                <p className="mt-3 text-sm text-slate-500">Select a team to see details.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
