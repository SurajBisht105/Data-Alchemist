import { ValidationError } from '@/types/data.types';

interface Props {
  results: ValidationError[];
}

export default function ValidationSummary({ results }: Props) {
  const stats = {
    total: results.length,
    errors: results.filter(r => r.severity === 'error').length,
    warnings: results.filter(r => r.severity === 'warning').length,
    byEntity: {
      clients: results.filter(r => r.entity === 'client').length,
      workers: results.filter(r => r.entity === 'worker').length,
      tasks: results.filter(r => r.entity === 'task').length,
    },
    fixable: results.filter(r => r.suggestion).length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-gray-600">Total Issues</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
        <div className="text-sm text-gray-600">Errors</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
        <div className="text-sm text-gray-600">Warnings</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-600">{stats.fixable}</div>
        <div className="text-sm text-gray-600">Auto-fixable</div>
      </div>
    </div>
  );
}