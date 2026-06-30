import { httpClient } from '../../lib/httpClient';
import type { SmartAssistantInput, SmartAssistantResponse } from '../../types/ai';

interface ApiWrappedResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function requestSmartAssistantOrchestration(input: SmartAssistantInput): Promise<SmartAssistantResponse> {
  const response = await httpClient.post<ApiWrappedResponse<SmartAssistantResponse> | SmartAssistantResponse>(
    '/ai/orchestrate',
    input,
  );

  const payload = response.data as ApiWrappedResponse<SmartAssistantResponse>;
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return response.data as SmartAssistantResponse;
}

interface IngestKnowledgeInput {
  documents: Array<{
    sourceKey: string;
    title: string;
    category: string;
    version: string;
    status: string;
    content: string;
  }>;
}

interface ApiSuccessMessage {
  success: boolean;
  message?: string;
}

export async function ingestKnowledge(input: IngestKnowledgeInput): Promise<ApiSuccessMessage> {
  const response = await httpClient.post<ApiSuccessMessage | ApiWrappedResponse<ApiSuccessMessage>>(
    '/knowledge/ingest',
    input,
  );

  const payload = response.data as ApiWrappedResponse<ApiSuccessMessage>;
  if (payload && typeof payload === 'object' && 'data' in payload && payload.data) {
    return payload.data;
  }

  return response.data as ApiSuccessMessage;
}
