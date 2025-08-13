import { Client, Worker, Task } from '@/types/data.types';

export function transformClientData(raw: any): Client {
  return {
    ClientID: String(raw.ClientID || ''),
    ClientName: String(raw.ClientName || ''),
    PriorityLevel: Number(raw.PriorityLevel) || 1,
    RequestedTaskIDs: parseArray(raw.RequestedTaskIDs),
    GroupTag: String(raw.GroupTag || ''),
    AttributesJSON: parseJSON(raw.AttributesJSON) || {}
  };
}

export function transformWorkerData(raw: any): Worker {
  return {
    WorkerID: String(raw.WorkerID || ''),
    WorkerName: String(raw.WorkerName || ''),
    Skills: parseArray(raw.Skills),
    AvailableSlots: parseNumberArray(raw.AvailableSlots),
    MaxLoadPerPhase: Number(raw.MaxLoadPerPhase) || 1,
    WorkerGroup: String(raw.WorkerGroup || ''),
    QualificationLevel: Number(raw.QualificationLevel) || 1
  };
}

export function transformTaskData(raw: any): Task {
  return {
    TaskID: String(raw.TaskID || ''),
    TaskName: String(raw.TaskName || ''),
    Category: String(raw.Category || ''),
    Duration: Number(raw.Duration) || 1,
    RequiredSkills: parseArray(raw.RequiredSkills),
    PreferredPhases: parseNumberArray(raw.PreferredPhases),
    MaxConcurrent: Number(raw.MaxConcurrent) || 1
  };
}

function parseArray(value: any): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function parseNumberArray(value: any): number[] {
  if (Array.isArray(value)) return value.map(Number).filter(n => !isNaN(n));
  if (typeof value === 'string') {
    // Handle range syntax (e.g., "1-5")
    if (value.includes('-') && /^\d+-\d+$/.test(value.trim())) {
      const [start, end] = value.split('-').map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    // Handle comma-separated
    return value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
  }
  return [];
}

function parseJSON(value: any): any {
  if (typeof value === 'object' && value !== null) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return null;
}