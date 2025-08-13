import { DataStore } from '@/types/data.types';
import { generateJSONContent } from './gemini';

interface SearchConfig {
  entityType: 'clients' | 'workers' | 'tasks';
  filter: {
    field: string;
    operator: 'equals' | 'contains' | 'greater' | 'less' | 'in';
    value: any;
  };
  explanation: string;
}

export async function searchWithNaturalLanguage(
  query: string,
  data: DataStore
): Promise<any[]> {
  // Validate input
  if (!data || !query) {
    console.error('Invalid input to searchWithNaturalLanguage:', { query, data });
    return [];
  }

  // Check if data has any content
  const hasClients = data.clients && data.clients.length > 0;
  const hasWorkers = data.workers && data.workers.length > 0;
  const hasTasks = data.tasks && data.tasks.length > 0;

  if (!hasClients && !hasWorkers && !hasTasks) {
    console.error('No data available to search');
    return [];
  }

  const prompt = `
    Convert this natural language query into a filter configuration: "${query}"
    
    Available data:
    - Clients (${data.clients?.length || 0} items): ${hasClients ? JSON.stringify(data.clients.slice(0, 2)) : 'No clients'}
    - Workers (${data.workers?.length || 0} items): ${hasWorkers ? JSON.stringify(data.workers.slice(0, 2)) : 'No workers'}
    - Tasks (${data.tasks?.length || 0} items): ${hasTasks ? JSON.stringify(data.tasks.slice(0, 2)) : 'No tasks'}
    
    Return a JSON object with this exact structure:
    {
      "entityType": "clients" or "workers" or "tasks",
      "filter": {
        "field": "the field name to filter on",
        "operator": "equals" or "contains" or "greater" or "less" or "in",
        "value": "the value to filter by (can be string, number, or array)"
      },
      "explanation": "Human-readable explanation of what this search does"
    }
    
    Only search in entity types that have data available.
  `;

  try {
    const searchConfig = await generateJSONContent<SearchConfig>(prompt);
    
    // Validate the entity type exists and has data
    const entityData = data[searchConfig.entityType];
    if (!entityData || !Array.isArray(entityData)) {
      console.error('Invalid entity type or no data:', searchConfig.entityType);
      return [];
    }
    
    // Apply the filter
    const results = applyFilter(entityData, searchConfig.filter);
    
    return results;
  } catch (error) {
    console.error('Natural language search failed:', error);
    return [];
  }
}

function applyFilter(items: any[], filter: any): any[] {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return [];
  }

  if (!filter || !filter.field) {
    return items; // Return all items if no valid filter
  }

  return items.filter(item => {
    if (!item) return false;
    
    const value = item[filter.field];
    
    switch (filter.operator) {
      case 'equals':
        return value === filter.value;
      case 'contains':
        if (Array.isArray(value)) {
          return value.some(v => 
            String(v).toLowerCase().includes(String(filter.value).toLowerCase())
          );
        }
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
      case 'greater':
        return Number(value) > Number(filter.value);
      case 'less':
        return Number(value) < Number(filter.value);
      case 'in':
        return Array.isArray(filter.value) ? filter.value.includes(value) : false;
      default:
        return true;
    }
  });
}