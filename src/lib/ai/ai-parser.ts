import { Client, Worker, Task } from '@/types/data.types';
import { generateJSONContent } from './gemini';

export async function parseWithAI(
  rawData: any[],
  entityType: 'client' | 'worker' | 'task'
): Promise<Client[] | Worker[] | Task[]> {
  const schema = getSchemaForEntity(entityType);
  
  const prompt = `
    Parse the following CSV data into the correct format.
    Expected schema: ${JSON.stringify(schema)}
    
    Handle these cases:
    - Misnamed columns (map to correct field names)
    - Different data formats (normalize them)
    - Missing fields (use sensible defaults)
    - Malformed data (fix or flag for review)
    
    Raw data (first 5 rows): ${JSON.stringify(rawData.slice(0, 5))}
    
    Return a JSON array of properly formatted objects matching the schema exactly.
    Ensure all required fields are present and properly typed.
  `;

  const result = await generateJSONContent<any[]>(prompt);
  return result;
}

function getSchemaForEntity(entityType: string) {
  const schemas = {
    client: {
      ClientID: 'string',
      ClientName: 'string',
      PriorityLevel: 'number (1-5)',
      RequestedTaskIDs: 'array of strings',
      GroupTag: 'string',
      AttributesJSON: 'object'
    },
    worker: {
      WorkerID: 'string',
      WorkerName: 'string',
      Skills: 'array of strings',
      AvailableSlots: 'array of numbers',
      MaxLoadPerPhase: 'number',
      WorkerGroup: 'string',
      QualificationLevel: 'number'
    },
    task: {
      TaskID: 'string',
      TaskName: 'string',
      Category: 'string',
      Duration: 'number',
      RequiredSkills: 'array of strings',
      PreferredPhases: 'array of numbers',
      MaxConcurrent: 'number'
    }
  };
  
  return schemas[entityType];
}