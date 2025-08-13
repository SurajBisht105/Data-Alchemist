import { create } from 'zustand';

interface PrioritiesState {
  priorities: Record<string, number>;
  updatePriority: (key: string, value: number) => void;
  applyPreset: (preset: Record<string, number>) => void;
  resetPriorities: () => void;
}

const defaultPriorities = {
  clientPriority: 50,
  taskCompletion: 50,
  workerBalance: 50,
  skillMatch: 50,
  phaseEfficiency: 50
};

export const usePriorities = create<PrioritiesState>((set) => ({
  priorities: defaultPriorities,
  
  updatePriority: (key, value) => set((state) => ({
    priorities: { ...state.priorities, [key]: value }
  })),
  
  applyPreset: (preset) => set({
    priorities: { ...defaultPriorities, ...preset }
  }),
  
  resetPriorities: () => set({
    priorities: defaultPriorities
  })
}));