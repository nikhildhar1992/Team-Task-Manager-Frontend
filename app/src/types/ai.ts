import type { TaskPriority } from './task';

export interface SmartAssistantInput {
  prompt: string;
}

export interface SmartTaskSuggestion {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
}

export interface SmartAssistantResponse {
  summary: string;
  suggestedPriority: TaskPriority;
  suggestedDeadline?: string;
  tasks: SmartTaskSuggestion[];
}
