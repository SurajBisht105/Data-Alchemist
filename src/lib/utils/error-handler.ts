import toast from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): void {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message || 'An unexpected error occurred');
  } else {
    toast.error('An unexpected error occurred');
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && 
    (error.message.includes('fetch') || 
     error.message.includes('network') ||
     error.message.includes('Network'));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}