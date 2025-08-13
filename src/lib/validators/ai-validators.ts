import { Client, Worker, Task, ValidationError } from '@/types/data.types';
import { generateJSONContent } from '@/lib/ai/gemini';

export async function runAIValidation(
  data: { clients: Client[], workers: Worker[], tasks: Task[] }
): Promise<ValidationError[]> {
  const prompt = `
    Analyze this resource allocation data for potential issues beyond standard validations:
    
    Clients (first 5): ${JSON.stringify(data.clients.slice(0, 5))}
    Workers (first 5): ${JSON.stringify(data.workers.slice(0, 5))}
    Tasks (first 5): ${JSON.stringify(data.tasks.slice(0, 5))}
    
    Look for:
    1. Logical inconsistencies
    2. Potential bottlenecks
    3. Unrealistic configurations
    4. Missing relationships
    5. Data quality issues
    6. Business rule violations
    
    Return an array of validation errors in this exact JSON format:
    [
      {
        "type": "string describing the issue type",
        "severity": "error" or "warning",
        "entity": "client" or "worker" or "task",
        "entityId": "the specific entity ID",
        "field": "optional field name",
        "message": "clear description of the issue",
        "suggestion": "how to fix the issue"
      }
    ]
    
    If no issues found, return an empty array: []
  `;

  try {
    const errors = await generateJSONContent<ValidationError[]>(prompt);
    return errors || [];
  } catch (error) {
    console.error('AI validation failed:', error);
    return [];
  }
}