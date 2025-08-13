import { useState } from 'react';
import { Rule } from '@/types/rules.types';

interface Props {
  rule: Rule;
  onUpdate: (rule: Rule) => void;
  onRemove: (ruleId: string) => void;
}

export default function RuleCard({ rule, onUpdate, onRemove }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rule);

  const renderRuleContent = () => {
    // Add safety checks for parameters
    if (!rule.parameters) {
      return <div className="text-gray-500">No parameters defined</div>;
    }

    switch (rule.type) {
      case 'coRun':
        return (
          <div>
            <span className="font-medium">Co-run Tasks:</span>
            <div className="mt-1">
              {rule.parameters.tasks?.length > 0 
                ? rule.parameters.tasks.join(', ')
                : 'No tasks specified'}
            </div>
          </div>
        );
      case 'slotRestriction':
        return (
          <div>
            <span className="font-medium">Slot Restriction:</span>
            <div className="mt-1">
              {rule.parameters.groupType || 'Unknown'} group {rule.parameters.group || 'Unknown'} 
              needs {rule.parameters.minCommonSlots || 0} common slots
            </div>
          </div>
        );
      case 'loadLimit':
        return (
          <div>
            <span className="font-medium">Load Limit:</span>
            <div className="mt-1">
              Group {rule.parameters.group || 'Unknown'} 
              max {rule.parameters.maxSlotsPerPhase || 0} slots per phase
            </div>
          </div>
        );
      case 'phaseWindow':
        return (
          <div>
            <span className="font-medium">Phase Window:</span>
            <div className="mt-1">
              Task {rule.parameters.taskId || 'Unknown'} allowed in phases: 
              {rule.parameters.allowedPhases?.length > 0 
                ? ' ' + rule.parameters.allowedPhases.join(', ')
                : ' None specified'}
            </div>
          </div>
        );
      case 'precedence':
        return (
          <div>
            <span className="font-medium">Precedence:</span>
            <div className="mt-1">
              {rule.parameters.before || 'Unknown'} must complete before {rule.parameters.after || 'Unknown'}
            </div>
          </div>
        );
      default:
        return (
          <div className="text-gray-500">
            Unknown rule type: {rule.type}
          </div>
        );
    }
  };

  const renderEditForm = () => {
    return (
      <div className="space-y-3">
        <textarea
          value={JSON.stringify(editedRule.parameters || {}, null, 2)}
          onChange={(e) => {
            try {
              const parameters = JSON.parse(e.target.value);
              setEditedRule({ ...editedRule, parameters });
            } catch (error) {
              // Invalid JSON, ignore the change
              console.error('Invalid JSON:', error);
            }
          }}
          className="w-full p-2 border rounded font-mono text-sm"
          rows={4}
          placeholder="{}"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              onUpdate(editedRule);
              setIsEditing(false);
            }}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditedRule(rule);
              setIsEditing(false);
            }}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? renderEditForm() : renderRuleContent()}
          {!isEditing && rule.description && (
            <p className="mt-2 text-sm text-gray-600">{rule.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>Created: {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString() : 'Unknown'}</span>
            <span>Source: {rule.source || 'manual'}</span>
          </div>
        </div>
        {!isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit rule"
            >
              ✏️
            </button>
            <button
              onClick={() => onRemove(rule.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete rule"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
