import { useState, useEffect } from 'react';
import { ValidationError } from '@/types/data.types';

interface Props {
  value: any;
  errors: ValidationError[];
  onUpdate: (value: any) => void;
  dataType: 'string' | 'number' | 'array' | 'json';
}

export default function GridCell({ value, errors, onUpdate, dataType }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue(formatValue(value, dataType));
  }, [value, dataType]);

  const formatValue = (val: any, type: string): string => {
    if (val === null || val === undefined) return '';
    
    switch (type) {
      case 'array':
        return Array.isArray(val) ? val.join(', ') : String(val);
      case 'json':
        return typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
      default:
        return String(val);
    }
  };

  const parseValue = (val: string, type: string): any => {
    switch (type) {
      case 'number':
        return Number(val);
      case 'array':
        return val.split(',').map(s => s.trim()).filter(Boolean);
      case 'json':
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      default:
        return val;
    }
  };

  const handleSave = () => {
    const parsedValue = parseValue(editValue, dataType);
    onUpdate(parsedValue);
    setIsEditing(false);
  };

  const hasError = errors.length > 0;
  const errorMessages = errors.map(e => e.message).join('; ');

  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm ${hasError ? 'bg-red-50' : ''}`}>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type={dataType === 'number' ? 'number' : 'text'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setEditValue(formatValue(value, dataType));
              setIsEditing(false);
            }}
            className="text-red-600 hover:text-red-800"
          >
            ✗
          </button>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${
            hasError ? 'border-2 border-red-300' : ''
          }`}
          title={hasError ? errorMessages : 'Click to edit'}
        >
          {formatValue(value, dataType) || <span className="text-gray-400">Empty</span>}
          {hasError && <span className="ml-2 text-red-600">⚠️</span>}
        </div>
      )}
    </td>
  );
}