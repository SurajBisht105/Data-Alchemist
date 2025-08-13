import { useState, useCallback } from 'react';
import { useDataStore } from './useDataStore';
import { ValidationEngine } from '@/lib/validators/validation-engine';
import { ValidationError } from '@/types/data.types';

export function useValidation() {
  const [validationResults, setValidationResults] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const { clients, workers, tasks } = useDataStore();

  const runValidation = useCallback(async () => {
    setIsValidating(true);
    
    try {
      const engine = new ValidationEngine();
      const results = await engine.validateAll({
        clients,
        workers,
        tasks
      });
      
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  }, [clients, workers, tasks]);

  const clearValidation = useCallback(() => {
    setValidationResults([]);
  }, []);

  return {
    validationResults,
    isValidating,
    runValidation,
    clearValidation
  };
}