export interface BaseRule {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  source: 'manual' | 'natural-language' | 'ai-suggested';
  enabled?: boolean;
  confidence?: number;
}

export interface CoRunRule extends BaseRule {
  type: 'coRun';
  parameters: {
    tasks: string[];
    strict?: boolean;
  };
}

export interface SlotRestrictionRule extends BaseRule {
  type: 'slotRestriction';
  parameters: {
    group: string;
    groupType: 'client' | 'worker';
    minCommonSlots: number;
  };
}

export interface LoadLimitRule extends BaseRule {
  type: 'loadLimit';
  parameters: {
    group: string;
    maxSlotsPerPhase: number;
  };
}

export interface PhaseWindowRule extends BaseRule {
  type: 'phaseWindow';
  parameters: {
    taskId: string;
    allowedPhases: number[];
  };
}

export interface PrecedenceRule extends BaseRule {
  type: 'precedence';
  parameters: {
    before: string;
    after: string;
    gap?: number;
  };
}

export interface PatternMatchRule extends BaseRule {
  type: 'patternMatch';
  parameters: {
    pattern: string;
    action: string;
    targets: string[];
  };
}

export type Rule = 
  | CoRunRule 
  | SlotRestrictionRule 
  | LoadLimitRule 
  | PhaseWindowRule 
  | PrecedenceRule
  | PatternMatchRule;

export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}