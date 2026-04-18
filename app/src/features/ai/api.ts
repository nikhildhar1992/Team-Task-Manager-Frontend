import { httpClient } from '../../lib/httpClient';
import type { SmartAssistantInput, SmartAssistantResponse } from '../../types/ai';

export async function requestSmartTaskBreakdown(
  input: SmartAssistantInput,
): Promise<SmartAssistantResponse> {
  const response = await httpClient.post<SmartAssistantResponse>('/ai/task-assistant', input);
  return response.data;
}
