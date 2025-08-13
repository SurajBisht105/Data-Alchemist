export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string[];
  GroupTag: string;
  AttributesJSON: Record<string, any>;
}

export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string[];
  AvailableSlots: number[];
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: number;
}

export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string[];
  PreferredPhases: number[];
  MaxConcurrent: number;
}

export interface DataStore {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  hasData: boolean;
}

export interface ValidationError {
  type: string;
  severity: 'error' | 'warning';
  entity: 'client' | 'worker' | 'task';
  entityId: string;
  field?: string;
  message: string;
  suggestion?: string;
}