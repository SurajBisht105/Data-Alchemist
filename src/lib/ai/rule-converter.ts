import { Rule } from '@/types/rules.types';
import { v4 as uuidv4 } from 'uuid';
import { generateJSONContent } from './gemini';

interface RuleConfig {
  type: string;
  parameters: any;
  description: string;
}

export async function convertNaturalLanguageToRule(input: string): Promise<Rule> {
  const prompt = `
    Convert this natural language rule into a structured format: "${input}"
    
    Available rule types:
    1. coRun: Tasks that must run together
    2. slotRestriction: Limit slots for a group
    3. loadLimit: Maximum load per worker/group
    4. phaseWindow: Restrict tasks to specific phases
    5. precedence: Task ordering constraints
    
    Return a JSON object with this exact structure:
    {
      "type": "one of the rule types above",
      "parameters": {
        // Type-specific parameters based on the rule type
      },
      "description": "Human-readable description of what this rule does"
    }
    
    Examples:
    - Input: "Tasks T12 and T14 must run together"
      Output: {"type": "coRun", "parameters": {"tasks": ["T12", "T14"]}, "description": "Tasks T12 and T14 must run together"}
    
    - Input: "Sales workers can only handle 3 tasks per phase"
      Output: {"type": "loadLimit", "parameters": {"group": "Sales", "maxLoad": 3}, "description": "Sales workers limited to 3 tasks per phase"}
  `;

  try {
    const ruleConfig = await generateJSONContent<RuleConfig>(prompt);
    
    return {
      id: uuidv4(),
      ...ruleConfig,
      createdAt: new Date().toISOString(),
      source: 'natural-language'
    } as Rule;
  } catch (error) {
    console.error('Rule conversion failed:', error);
    throw new Error('Failed to convert rule');
  }
}