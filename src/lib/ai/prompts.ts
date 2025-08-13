export const PROMPTS = {
  PARSE_DATA: (entityType: string, schema: any) => `
    Parse the following CSV data into the correct format for ${entityType}.
    Expected schema: ${JSON.stringify(schema)}
    
    Handle these cases:
    - Misnamed columns (map to correct field names)
    - Different data formats (normalize them)
    - Missing fields (use sensible defaults)
    - Malformed data (fix or flag for review)
    
    Return a JSON array of properly formatted objects matching the schema exactly.
  `,

  VALIDATE_DATA: `
    Analyze this resource allocation data for potential issues beyond standard validations.
    Look for:
    1. Logical inconsistencies
    2. Potential bottlenecks
    3. Unrealistic configurations
    4. Missing relationships
    5. Data quality issues
    6. Business rule violations
    
    Return validation errors as a JSON array with severity levels and suggestions.
  `,

  NATURAL_LANGUAGE_SEARCH: (query: string) => `
    Convert this natural language query into a data filter: "${query}"
    
    Return a structured JSON filter that can be applied to the data.
    Include the entity type, field, operator, and value.
  `,

  RULE_CONVERSION: (input: string) => `
    Convert this natural language rule into a structured format: "${input}"
    
    Map it to one of these rule types:
    - coRun: Tasks that must run together
    - slotRestriction: Limit slots for a group
    - loadLimit: Maximum load per worker/group
    - phaseWindow: Restrict tasks to specific phases
    - precedence: Task ordering constraints
    
    Return the structured rule as JSON with parameters.
  `,

  GENERATE_CORRECTIONS: (error: any) => `
    Suggest a correction for this validation error:
    ${JSON.stringify(error)}
    
    Return the specific field and corrected value as JSON.
  `
};