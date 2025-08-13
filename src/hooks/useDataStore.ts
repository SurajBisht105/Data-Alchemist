import { create } from 'zustand';
import { Client, Worker, Task } from '@/types/data.types';

interface DataStore {
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  hasData: boolean;
}

interface DataStoreState extends DataStore {
  uploadData: (data: Partial<DataStore>) => void;
  updateData: (entityType: string, entityId: string, field: string, value: any) => void;
  clearData: () => void;
  getDataForExport: () => { clients: Client[], workers: Worker[], tasks: Task[] };
}

export const useDataStore = create<DataStoreState>((set, get) => ({
  // Initial state
  clients: [],
  workers: [],
  tasks: [],
  hasData: false,

  // Actions
  uploadData: (data) => set((state) => ({
    clients: data.clients || state.clients,
    workers: data.workers || state.workers,
    tasks: data.tasks || state.tasks,
    hasData: true
  })),

  updateData: (entityType, entityId, field, value) => set((state) => {
    const updateEntity = (items: any[]) => 
      items.map(item => {
        const idField = entityType === 'clients' ? 'ClientID' : 
                       entityType === 'workers' ? 'WorkerID' : 'TaskID';
        return item[idField] === entityId 
          ? { ...item, [field]: value }
          : item;
      });

    return {
      ...state,
      [entityType]: updateEntity(state[entityType as keyof DataStore] as any[])
    };
  }),

  clearData: () => set({
    clients: [],
    workers: [],
    tasks: [],
    hasData: false
  }),

  getDataForExport: () => {
    const state = get();
    return {
      clients: state.clients,
      workers: state.workers,
      tasks: state.tasks
    };
  }
}));