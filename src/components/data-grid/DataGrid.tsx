import { useState, useMemo } from 'react';
import { DataStore, ValidationError } from '@/types/data.types';
import GridCell from './GridCell';
import GridToolbar from './GridToolbar';
import { useAI } from '@/hooks/useAI';

interface Props {
  data: DataStore;
  onUpdate: (entityType: string, entityId: string, field: string, value: any) => void;
  validationResults: ValidationError[];
}

export default function DataGrid({ data, onUpdate, validationResults }: Props) {
  const [activeEntity, setActiveEntity] = useState<'clients' | 'workers' | 'tasks'>('clients');
  const [filter, setFilter] = useState('');
  const { applySuggestion } = useAI();

  const getErrorsForCell = (entityType: string, entityId: string, field: string) => {
    return validationResults.filter(
      error => error.entity === entityType && 
               error.entityId === entityId && 
               error.field === field
    );
  };

  const filteredData = useMemo(() => {
    const items = data[activeEntity];
    if (!filter) return items;
    
    return items.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, activeEntity, filter]);

  const columns = useMemo(() => {
    switch (activeEntity) {
      case 'clients':
        return ['ClientID', 'ClientName', 'PriorityLevel', 'RequestedTaskIDs', 'GroupTag', 'AttributesJSON'];
      case 'workers':
        return ['WorkerID', 'WorkerName', 'Skills', 'AvailableSlots', 'MaxLoadPerPhase', 'WorkerGroup', 'QualificationLevel'];
      case 'tasks':
        return ['TaskID', 'TaskName', 'Category', 'Duration', 'RequiredSkills', 'PreferredPhases', 'MaxConcurrent'];
      default:
        return [];
    }
  }, [activeEntity]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {(['clients', 'workers', 'tasks'] as const).map(entity => (
          <button
            key={entity}
            onClick={() => setActiveEntity(entity)}
            className={`px-4 py-2 font-medium capitalize ${
              activeEntity === entity
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {entity} ({data[entity].length})
          </button>
        ))}
      </div>

      <GridToolbar 
        onFilterChange={setFilter}
        onExport={() => {/* implement export */}}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item: any) => (
              <tr key={item[columns[0]]} className="hover:bg-gray-50">
                {columns.map(column => {
                  const errors = getErrorsForCell(activeEntity, item[columns[0]], column);
                  return (
                    <GridCell
                      key={column}
                      value={item[column]}
                      errors={errors}
                      onUpdate={(newValue) => onUpdate(activeEntity, item[columns[0]], column, newValue)}
                      dataType={getDataType(column)}
                    />
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {validationResults
                    .filter(e => e.entity === activeEntity && e.entityId === item[columns[0]] && e.suggestion)
                    .slice(0, 1)
                    .map(error => (
                      <button
                        key={error.type}
                        onClick={() => applySuggestion(error)}
                        className="text-blue-600 hover:text-blue-800"
                        title={error.suggestion}
                      >
                        ✨ Fix
                      </button>
                    ))
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getDataType(column: string): 'string' | 'number' | 'array' | 'json' {
  if (column.includes('ID') || column.includes('Name') || column === 'Category' || column === 'GroupTag' || column === 'WorkerGroup') {
    return 'string';
  }
  if (column === 'PriorityLevel' || column === 'Duration' || column === 'MaxLoadPerPhase' || column === 'QualificationLevel' || column === 'MaxConcurrent') {
    return 'number';
  }
  if (column.includes('Skills') || column.includes('Slots') || column.includes('TaskIDs') || column.includes('Phases')) {
    return 'array';
  }
  if (column.includes('JSON')) {
    return 'json';
  }
  return 'string';
}