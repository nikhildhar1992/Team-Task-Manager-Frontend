import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { toApiError } from '../../lib/apiError';
import { useAuth } from '../auth/useAuth';
import { useTeams } from '../team/hooks';
import { useKnowledgeIngestMutation, useSmartAssistantMutation } from './hooks';

const INGEST_PAYLOAD = {
  documents: [
    {
      sourceKey: 'shipping-mini-v1',
      title: 'Shipping Mini',
      category: 'shipping',
      version: 'v1',
      status: 'active',
      content: 'Metro delivery takes 2-4 days. Non-metro takes 4-7 days.',
    },
    {
      sourceKey: 'orders-mini-v1',
      title: 'Order Status Mini',
      category: 'orders',
      version: 'v1',
      status: 'active',
      content: 'Order flow is placed, paid, shipped, delivered. Cancelled is terminal.',
    },
    {
      sourceKey: 'tasks-mini-v1',
      title: 'Task Rules Mini',
      category: 'team_task',
      version: 'v1',
      status: 'active',
      content: 'Task fields are title, description, status, priority, assigned user, deadline.',
    },
  ],
};

export function SmartAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [ingestMessage, setIngestMessage] = useState<string | null>(null);

  const { session } = useAuth();
  const teamsQuery = useTeams();
  const assistantMutation = useSmartAssistantMutation();
  const ingestMutation = useKnowledgeIngestMutation();
  const inferredTeamId = teamsQuery.data?.[0]?.id;
  const canIngest = session?.user?.email?.toLowerCase() === 'nikhildhar@gmail.com';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      setValidationMessage('Please enter a message.');
      return;
    }

    setValidationMessage(null);
    assistantMutation.mutate({
      prompt: prompt.trim(),
      teamId: inferredTeamId,
    });
  }

  function handleIngest() {
    setIngestMessage(null);
    ingestMutation.mutate(INGEST_PAYLOAD, {
      onSuccess: (result) => {
        setIngestMessage(result.message || 'Knowledge ingest completed.');
      },
      onError: (error) => {
        setIngestMessage(toApiError(error).message);
      },
    });
  }

  const agentTypeLabel =
    assistantMutation.data?.agentType === 'task_breakdown'
      ? 'Task Breakdown'
      : assistantMutation.data?.agentType === 'operations'
        ? 'Operations'
        : assistantMutation.data?.agentType === 'general'
          ? 'General'
          : 'N/A';

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Smart Assistant</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ask one question. The backend orchestrator auto-routes to the right agent and returns a grounded response.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Prompt</span>
            <textarea
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="How should I plan my launch and checkout flow?"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>

          {validationMessage ? <p className="text-sm text-red-700">{validationMessage}</p> : null}

          <button
            type="submit"
            disabled={assistantMutation.isPending}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {assistantMutation.isPending ? 'Thinking...' : 'Ask Assistant'}
          </button>
        </form>
      </section>

      {canIngest ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">Ingest</h3>
          <p className="mt-1 text-sm text-slate-600">
            Pushes the default mini documents to the backend knowledge store.
          </p>
          <button
            type="button"
            className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={handleIngest}
            disabled={ingestMutation.isPending}
          >
            {ingestMutation.isPending ? 'Ingesting...' : 'Run Ingest'}
          </button>
          {ingestMessage ? <p className="mt-2 text-sm text-slate-700">{ingestMessage}</p> : null}
        </section>
      ) : null}

      {assistantMutation.isPending ? <LoadingState message="Generating AI task suggestions..." /> : null}

      {assistantMutation.error ? (
        <ErrorState
          error={assistantMutation.error}
          title={toApiError(assistantMutation.error).status === 429 ? 'Rate limited' : 'AI assistant error'}
        />
      ) : null}

      {assistantMutation.isSuccess ? (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Suggested Plan</h3>
            <p className="mt-1 text-sm text-slate-700">{assistantMutation.data.summary}</p>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-slate-500">Agent Type</p>
              <p className="font-semibold text-slate-900">{agentTypeLabel}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-slate-500">Confidence</p>
              <p className="font-semibold text-slate-900">
                {typeof assistantMutation.data.confidence === 'number'
                  ? `${Math.round(assistantMutation.data.confidence * 100)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>

          {assistantMutation.data.tasks && assistantMutation.data.tasks.length > 0 ? (
            <ul className="space-y-3">
              {assistantMutation.data.tasks.map((task, index) => (
                <li key={`${task.title}-${index}`} className="rounded-md border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{task.description || 'No description provided.'}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Priority: {task.priority} | Deadline: {task.deadline || '-'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No task breakdown returned"
              description="Try a more detailed prompt for stronger suggestions."
            />
          )}

          {assistantMutation.data.sources && assistantMutation.data.sources.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Grounded by sources</h4>
              <ul className="mt-2 space-y-2">
                {assistantMutation.data.sources.map((source) => (
                  <li key={`${source.type}-${source.id}`} className="rounded-md border border-slate-200 p-3 text-sm">
                    <p className="font-medium text-slate-900">
                      [{source.type}] {source.title || source.id}
                    </p>
                    {source.excerpt ? <p className="mt-1 text-slate-600">{source.excerpt}</p> : null}
                    {typeof source.score === 'number' ? (
                      <p className="mt-1 text-xs text-slate-500">Score: {source.score.toFixed(2)}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {assistantMutation.data.followUpQuestions && assistantMutation.data.followUpQuestions.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Follow-up questions</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {assistantMutation.data.followUpQuestions.map((question, index) => (
                  <li key={`${question}-${index}`}>{question}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
