import { create } from 'zustand';
import { Rule } from '@/types/rules.types';

interface RulesState {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  updateRule: (rule: Rule) => void;
  removeRule: (ruleId: string) => void;
  clearRules: () => void;
}

export const useRules = create<RulesState>((set) => ({
  rules: [],
  
  addRule: (rule) => set((state) => ({
    rules: [...state.rules, rule]
  })),
  
  updateRule: (rule) => set((state) => ({
    rules: state.rules.map(r => r.id === rule.id ? rule : r)
  })),
  
  removeRule: (ruleId) => set((state) => ({
    rules: state.rules.filter(r => r.id !== ruleId)
  })),
  
  clearRules: () => set({ rules: [] })
}));