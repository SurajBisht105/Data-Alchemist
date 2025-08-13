import { DataStore } from '@/types/data.types';
import { Rule } from '@/types/rules.types';
import { generateJSONContent } from './gemini';

interface RuleSuggestion {
  type: 'coRun' | 'loadLimit' | 'phaseWindow' | 'slotRestriction';
  parameters: any;
  description: string;
  confidence: number;
}

export async function generateAIRules(data: DataStore): Promise<Rule[]> {
  // Validate input
  if (!data) {
    console.error('No data provided to generateAIRules');
    return [];
  }

  // Check if we have any data to analyze
  const hasClients = data.clients && data.clients.length > 0;
  const hasWorkers = data.workers && data.workers.length > 0;
  const hasTasks = data.tasks && data.tasks.length > 0;

  if (!hasClients && !hasWorkers && !hasTasks) {
    console.error('No data available to analyze for rules');
    return [];
  }

  const prompt = `
    Analyze this resource allocation data and suggest business rules:
    
    Clients (${data.clients?.length || 0} total): ${hasClients ? JSON.stringify(data.clients.slice(0, 10)) : 'No clients'}
    Workers (${data.workers?.length || 0} total): ${hasWorkers ? JSON.stringify(data.workers.slice(0, 10)) : 'No workers'}
    Tasks (${data.tasks?.length || 0} total): ${hasTasks ? JSON.stringify(data.tasks.slice(0, 10)) : 'No tasks'}
    
    Look for patterns and suggest rules such as:
    1. Tasks that often appear together (co-run rules)
    2. Worker groups that might need load limits
    3. Tasks that should be restricted to certain phases
    4. Skill-based restrictions
    
    Return an array of rule suggestions in this exact JSON format:
    [
      {
        "type": "coRun" or "loadLimit" or "phaseWindow" or "slotRestriction",
        "parameters": {
          // Parameters specific to the rule type
        },
        "description": "Clear explanation of why this rule is suggested",
        "confidence": 0.0 to 1.0 (how confident you are in this suggestion)
      }
    ]
    
    Return at least 3 suggestions if patterns are found, or empty array [] if no clear patterns.
    Base suggestions only on the data that is actually available.
  `;

  try {
    const suggestions = await generateJSONContent<RuleSuggestion[]>(prompt);
    
    // Ensure we got an array
    if (!Array.isArray(suggestions)) {
      console.error('Invalid response from AI: expected array');
      return [];
    }
    
    // Convert to Rule format with proper IDs
    return suggestions.map((rule: RuleSuggestion) => ({
      id: crypto.randomUUID(),
      type: rule.type,
      parameters: rule.parameters || {},
      description: rule.description || 'AI-generated rule',
      confidence: rule.confidence || 0.5,
      createdAt: new Date().toISOString(),
      source: 'ai-suggested' as const,
      enabled: true
    }));
  } catch (error) {
    console.error('Failed to generate AI rules:', error);
    return [];
  }
}