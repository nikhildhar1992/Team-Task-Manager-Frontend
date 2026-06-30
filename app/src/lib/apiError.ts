import axios from 'axios';

export interface ApiError {
  message: string;
  status?: number;
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; error?: string } | undefined;

    const message =
      data?.message ??
      data?.error ??
      (status === 429
        ? 'Rate limit reached. Please wait and try again.'
        : error.message || 'Request failed.');

    return { message, status };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Something went wrong.' };
}

export function isRateLimitError(error: unknown): boolean {
  return toApiError(error).status === 429;
}
