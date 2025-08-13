import { useState } from 'react';
import { useRules } from '@/hooks/useRules';
import NaturalLanguageInput from './NaturalLanguageInput';
import RuleCard from './RuleCard';
import { Rule } from '@/types/rules.types';

export default function RuleBuilder() {
  const { rules, addRule, removeRule, updateRule } = useRules();
  const [showNLInput, setShowNLInput] = useState(false);

  const ruleTemplates = [
    { type: 'coRun', label: 'Co-run Tasks', icon: '🔗' },
    { type: 'slotRestriction', label: 'Slot Restriction', icon: '🎯' },
    { type: 'loadLimit', label: 'Load Limit', icon: '⚖️' },
    { type: 'phaseWindow', label: 'Phase Window', icon: '📅' },
    { type: 'precedence', label: 'Precedence', icon: '📊' },
  ];

  const createNewRule = (type: string): Rule => {
    const baseRule = {
      id: crypto.randomUUID(),
      type,
      description: '',
      createdAt: new Date().toISOString(),
      source: 'manual' as const,
    };

    // Initialize with proper parameters based on type
    switch (type) {
      case 'coRun':
        return { ...baseRule, parameters: { tasks: [] } } as Rule;
      case 'slotRestriction':
        return { 
          ...baseRule, 
          parameters: { 
            group: '', 
            groupType: 'client' as const, 
            minCommonSlots: 1 
          } 
        } as Rule;
      case 'loadLimit':
        return { 
          ...baseRule, 
          parameters: { 
            group: '', 
            maxSlotsPerPhase: 1 
          } 
        } as Rule;
      case 'phaseWindow':
        return { 
          ...baseRule, 
          parameters: { 
            taskId: '', 
            allowedPhases: [] 
          } 
        } as Rule;
      case 'precedence':
        return { 
          ...baseRule, 
          parameters: { 
            before: '', 
            after: '' 
          } 
        } as Rule;
      default:
        return { ...baseRule, parameters: {} } as Rule;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Business Rules</h2>
        <button
          onClick={() => setShowNLInput(!showNLInput)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <span>✨</span> AI Rule Builder
        </button>
      </div>

      {showNLInput && (
        <NaturalLanguageInput
          onRuleCreated={(rule) => {
            addRule(rule);
            setShowNLInput(false);
          }}
          onClose={() => setShowNLInput(false)}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ruleTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => addRule(createNewRule(template.type))}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">{template.icon}</div>
            <div className="font-medium">{template.label}</div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onUpdate={updateRule}
            onRemove={removeRule}
          />
        ))}
      </div>

      {rules.length > 0 && (
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Generate Rules Config
          </button>
        </div>
      )}
    </div>
  );
}