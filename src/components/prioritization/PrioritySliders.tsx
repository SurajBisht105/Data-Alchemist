import { useState } from 'react';
import { usePriorities } from '@/hooks/usePriorities';

interface PriorityCriteria {
  id: string;
  label: string;
  description: string;
  weight: number;
}

export default function PrioritySliders() {
  const { priorities, updatePriority, applyPreset } = usePriorities();
  const [selectedPreset, setSelectedPreset] = useState('custom');

  const criteria: PriorityCriteria[] = [
    {
      id: 'clientPriority',
      label: 'Client Priority',
      description: 'Favor high-priority clients',
      weight: priorities.clientPriority || 50
    },
    {
      id: 'taskCompletion',
      label: 'Task Completion',
      description: 'Maximize number of completed tasks',
      weight: priorities.taskCompletion || 50
    },
    {
      id: 'workerBalance',
      label: 'Worker Balance',
      description: 'Distribute work evenly among workers',
      weight: priorities.workerBalance || 50
    },
    {
      id: 'skillMatch',
      label: 'Skill Match',
      description: 'Optimize worker-task skill alignment',
      weight: priorities.skillMatch || 50
    },
    {
      id: 'phaseEfficiency',
      label: 'Phase Efficiency',
      description: 'Minimize phase transitions',
      weight: priorities.phaseEfficiency || 50
    }
  ];

  const presets = [
    { id: 'custom', label: 'Custom', values: {} },
    { 
      id: 'maxFulfillment', 
      label: 'Maximize Fulfillment', 
      values: { 
        clientPriority: 80, 
        taskCompletion: 90, 
        workerBalance: 30, 
        skillMatch: 60, 
        phaseEfficiency: 40 
      } 
    },
    { 
      id: 'fairDistribution', 
      label: 'Fair Distribution', 
      values: { 
        clientPriority: 50, 
        taskCompletion: 50, 
        workerBalance: 90, 
        skillMatch: 50, 
        phaseEfficiency: 50 
      } 
    },
    { 
      id: 'efficiency', 
      label: 'Maximum Efficiency', 
      values: { 
        clientPriority: 40, 
        taskCompletion: 60, 
        workerBalance: 50, 
        skillMatch: 80, 
        phaseEfficiency: 90 
      } 
    }
  ];

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset && preset.values && Object.keys(preset.values).length > 0) {
      applyPreset(preset.values);
    }
  };

  const handleSliderChange = (criterionId: string, value: number) => {
    updatePriority(criterionId, value);
    setSelectedPreset('custom'); // Switch to custom when manually adjusting
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Prioritization & Weights</h2>
        <p className="text-gray-600 mb-6">
          Adjust the sliders to set relative importance for different allocation criteria.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preset Profiles
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {criteria.map(criterion => (
          <div key={criterion.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{criterion.label}</h3>
                <p className="text-sm text-gray-500">{criterion.description}</p>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {criterion.weight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={criterion.weight}
              onChange={(e) => handleSliderChange(criterion.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${criterion.weight}%, #e5e7eb ${criterion.weight}%, #e5e7eb 100%)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2">Weight Distribution</h3>
        <div className="flex gap-4 flex-wrap">
          {criteria.map(criterion => (
            <div key={criterion.id} className="text-sm">
              <span className="font-medium">{criterion.label}:</span>
              <span className="ml-1 text-blue-600">{criterion.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Export Configuration
        </button>
      </div>
    </div>
  );
}