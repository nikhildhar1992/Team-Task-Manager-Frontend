import { FormEvent, useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { toApiError } from '../../lib/apiError';
import { useSmartAssistantMutation } from './hooks';

export function SmartAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const assistantMutation = useSmartAssistantMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      setValidationMessage('Please provide a prompt to generate task suggestions.');
      return;
    }

    setValidationMessage(null);
    assistantMutation.mutate({ prompt: prompt.trim() });
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">Smart Task Assistant</h2>
        <p className="mt-1 text-sm text-slate-600">
          Describe a goal and get AI-generated task breakdowns with priority and deadlines.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Prompt</span>
            <textarea
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Plan a product launch"
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
            {assistantMutation.isPending ? 'Generating...' : 'Generate Suggestions'}
          </button>
        </form>
      </section>

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
              <p className="text-slate-500">Suggested Priority</p>
              <p className="font-semibold text-slate-900">{assistantMutation.data.suggestedPriority}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-slate-500">Suggested Deadline</p>
              <p className="font-semibold text-slate-900">{assistantMutation.data.suggestedDeadline || '-'}</p>
            </div>
          </div>

          {assistantMutation.data.tasks.length > 0 ? (
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
        </section>
      ) : null}
    </div>
  );
}
