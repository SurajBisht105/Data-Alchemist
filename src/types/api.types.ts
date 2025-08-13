export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: 'success' | 'error';
}

export interface ParseRequest {
  data: any[];
  entityType: 'client' | 'worker' | 'task';
  useAI?: boolean;
}

export interface ValidationRequest {
  clients: any[];
  workers: any[];
  tasks: any[];
}

export interface RuleConversionRequest {
  action: 'convert' | 'recommend';
  input?: string;
  data?: any;
}

export interface ChatRequest {
  message: string;
  context: {
    hasData: boolean;
    dataStats: {
      clients: number;
      workers: number;
      tasks: number;
    };
  };
}

export interface ExportRequest {
  data: {
    clients: any[];
    workers: any[];
    tasks: any[];
  };
  rules: any[];
  priorities: Record<string, number>;
}