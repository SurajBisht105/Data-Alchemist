export class GeminiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

export function handleGeminiError(error: any): never {
  console.error('Gemini API Error:', error);
  
  if (error.message?.includes('API key')) {
    throw new GeminiError(
      'Invalid or missing Gemini API key',
      'INVALID_API_KEY'
    );
  }
  
  if (error.message?.includes('quota')) {
    throw new GeminiError(
      'Gemini API quota exceeded',
      'QUOTA_EXCEEDED'
    );
  }
  
  if (error.message?.includes('rate limit')) {
    throw new GeminiError(
      'Gemini API rate limit exceeded',
      'RATE_LIMITED'
    );
  }
  
  throw new GeminiError(
    'Failed to process request with Gemini',
    'GEMINI_ERROR',
    error
  );
}