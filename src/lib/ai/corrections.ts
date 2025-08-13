import { ValidationError } from '@/types/data.types';
import { useDataStore } from '@/hooks/useDataStore';
import { generateJSONContent } from './gemini';

interface CorrectionResult {
  field: string;
  newValue: any;
  explanation: string;
}

export async function applyAICorrection(error: ValidationError): Promise<void> {
  if (!error.suggestion) return;

  const prompt = `
    Apply this correction to fix a validation error:
    
    Error Details:
    - Type: ${error.type}
    - Message: ${error.message}
    - Entity Type: ${error.entity}
    - Entity ID: ${error.entityId}
    - Field: ${error.field || 'N/A'}
    - Suggestion: ${error.suggestion}
    
    Return the correction in this exact JSON format:
    {
      "field": "the field name to update",
      "newValue": "the corrected value (can be string, number, array, or object)",
      "explanation": "brief explanation of what was changed and why"
    }
    
    Ensure the newValue is properly typed based on the field.
  `;

  try {
    const correction = await generateJSONContent<CorrectionResult>(prompt);
    
    // Apply the correction through the data store
    const store = useDataStore.getState();
    store.updateData(error.entity + 's', error.entityId, correction.field, correction.newValue);
    
  } catch (error) {
    console.error('Failed to apply AI correction:', error);
    throw error;
  }
}