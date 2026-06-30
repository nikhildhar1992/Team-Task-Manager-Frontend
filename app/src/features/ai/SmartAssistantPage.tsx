import { useState } from 'react';
import type { FormEvent } from 'react';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { toApiError } from '../../lib/apiError';
import { useTeams } from '../team/hooks';
import { useKnowledgeIngestMutation, useSmartAssistantMutation } from './hooks';

const DEFAULT_KNOWLEDGE_TEXT =
  'Discover the authentic richness of Kashmir with our premium collection of dry fruits, carefully selected for freshness, taste, and natural goodness. From crunchy Kashmiri almonds starting at Rs. 799/kg and rich walnuts at Rs. 899/kg to sweet raisins at Rs. 349/kg, buttery cashews at Rs. 749/kg, and premium pistachios at Rs. 999/kg, every bite brings pure quality. Enjoy soft dried apricots from Rs. 599/kg, nutritious figs from Rs. 699/kg, dates from Rs. 399/kg, and pure Kashmiri saffron from Rs. 249/gm for a luxurious touch. Perfect for daily health, festive gifting, weddings, corporate hampers, and family snacking, our dry fruits are packed with nutrition, aroma, and traditional Kashmiri flavor. Whether you want energy-boosting snacks, premium gifts, or ingredients for sweets and desserts, we bring the finest selection straight to your doorstep. Experience trust, purity, and taste in every pack, and make every occasion healthier and more special with the goodness of Kashmir.';

export function SmartAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [knowledgeText, setKnowledgeText] = useState(DEFAULT_KNOWLEDGE_TEXT);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [ingestMessage, setIngestMessage] = useState<string | null>(null);

  const teamsQuery = useTeams();
  const assistantMutation = useSmartAssistantMutation();
  const ingestMutation = useKnowledgeIngestMutation();
  const inferredTeamId = teamsQuery.data?.[0]?.id;

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
    if (!knowledgeText.trim()) {
      setIngestMessage('Please enter knowledge content before saving it to RAG.');
      return;
    }

    setIngestMessage(null);
    ingestMutation.mutate(
      {
        documents: [
          {
            sourceKey: 'recruiter-rag-demo-v1',
            title: 'Recruiter RAG Demo Knowledge',
            category: 'products',
            version: 'v1',
            status: 'active',
            content: knowledgeText.trim(),
          },
        ],
      },
      {
        onSuccess: (result) => {
          setIngestMessage(result.message || 'Knowledge saved to RAG. You can now ask questions below.');
        },
        onError: (error) => {
          setIngestMessage(toApiError(error).message);
        },
      },
    );
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
        <h2 className="text-xl font-semibold text-slate-900">RAG Knowledge Demo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste knowledge, save it to the vector knowledge store, then ask questions grounded in that content.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">1. Add RAG Knowledge</h3>
        <p className="mt-1 text-sm text-slate-600">
          This is the context the assistant will retrieve from when answering questions.
        </p>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Knowledge content</span>
          <textarea
            rows={7}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Paste product details, company info, policies, CV content, or any knowledge you want to query."
            value={knowledgeText}
            onChange={(event) => setKnowledgeText(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          onClick={handleIngest}
          disabled={ingestMutation.isPending}
        >
          {ingestMutation.isPending ? 'Saving to RAG...' : 'Save Knowledge to RAG'}
        </button>
        {ingestMessage ? <p className="mt-2 text-sm text-slate-700">{ingestMessage}</p> : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-base font-semibold text-slate-900">2. Ask a Question</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ask about the knowledge above after saving it to RAG.
            </p>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Question</span>
            <textarea
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="Example: What is the price of Kashmiri almonds?"
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
            {assistantMutation.isPending ? 'Thinking...' : 'Ask from RAG'}
          </button>
        </form>
      </section>

      {assistantMutation.isPending ? <LoadingState message="Searching RAG knowledge and generating an answer..." /> : null}

      {assistantMutation.error ? (
        <ErrorState
          error={assistantMutation.error}
          title={toApiError(assistantMutation.error).status === 429 ? 'Rate limited' : 'AI assistant error'}
        />
      ) : null}

      {assistantMutation.isSuccess ? (
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">RAG Answer</h3>
            <p className="mt-1 text-sm text-slate-700">{assistantMutation.data.summary}</p>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-slate-500">Agent Type</p>
              <p className="font-semibold text-slate-900">{agentTypeLabel}</p>
            </div>
          </div>

          {assistantMutation.data.tasks && assistantMutation.data.tasks.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Generated Tasks</h4>
              <ul className="mt-2 space-y-3">
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
            </div>
          ) : null}

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
