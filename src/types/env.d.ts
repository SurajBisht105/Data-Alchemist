declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GEMINI_API_KEY: string;
      NEXT_PUBLIC_ENABLE_AI_PARSING?: string;
      NEXT_PUBLIC_ENABLE_AI_VALIDATION?: string;
      NEXT_PUBLIC_ENABLE_AI_RULES?: string;
      NODE_ENV: 'development' | 'production' | 'test';
      VERCEL_URL?: string;
      API_SECRET_KEY?: string;
    }
  }
}

export {}