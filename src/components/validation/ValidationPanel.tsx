import { useState } from 'react';
import { ValidationError } from '@/types/data.types';
import ValidationSummary from './ValidationSummary';
import { useAI } from '@/hooks/useAI';

interface Props {
  results: ValidationError[];
  onRunValidation: () => void;
}

export default function ValidationPanel({ results, onRunValidation }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { applySuggestion, loading } = useAI();
  
  const errorCount = results.filter(r => r.severity === 'error').length;
  const warningCount = results.filter(r => r.severity === 'warning').length;

  const groupedResults = results.reduce((acc, error) => {
    const key = error.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  return (
    <div className="mt-6 border rounded-lg bg-white shadow-sm">
      <div 
        className="px-6 py-4 border-b flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold">Validation Results</h3>
          <div className="flex gap-3">
            {errorCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                {errorCount} errors
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                {warningCount} warnings
              </span>
            )}
            {errorCount === 0 && warningCount === 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                All validations passed
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRunValidation();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Run Validation
          </button>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && results.length > 0 && (
        <div className="p-6">
          <ValidationSummary results={results} />
          
          <div className="mt-6 space-y-4">
            {Object.entries(groupedResults).map(([type, errors]) => (
              <div key={type} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 capitalize">
                  {type.replace(/_/g, ' ')} ({errors.length})
                </h4>
                <div className="space-y-2">
                  {errors.slice(0, 5).map((error, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg flex items-start justify-between ${
                        error.severity === 'error' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${
                            error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {error.severity === 'error' ? '❌' : '⚠️'}
                          </span>
                          <span className="font-medium">
                            {error.entity} - {error.entityId}
                          </span>
                          {error.field && (
                            <span className="text-sm text-gray-600">
                              ({error.field})
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm">{error.message}</p>
                        {error.suggestion && (
                          <p className="mt-1 text-sm text-gray-600">
                            💡 {error.suggestion}
                          </p>
                        )}
                      </div>
                      {error.suggestion && (
                        <button
                          onClick={() => applySuggestion(error)}
                          disabled={loading}
                          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Apply Fix
                        </button>
                      )}
                    </div>
                  ))}
                  {errors.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      And {errors.length - 5} more...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}