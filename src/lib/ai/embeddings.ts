import { generateContent } from './gemini';

// Note: Gemini doesn't have a direct embedding API like OpenAI
// We'll use a workaround by generating semantic descriptions
export async function generateEmbedding(text: string): Promise<string> {
  const prompt = `
    Generate a concise semantic summary of this text for similarity comparison:
    "${text}"
    
    Return only a short descriptive phrase that captures the key meaning.
  `;
  
  try {
    const embedding = await generateContent(prompt);
    return embedding.trim();
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return text; // Fallback to original text
  }
}

export async function semanticSearch(
  query: string,
  items: any[],
  textField: string,
  threshold: number = 0.7
): Promise<any[]> {
  // For Gemini, we'll use a different approach
  const prompt = `
    Given this search query: "${query}"
    
    And these items:
    ${items.map((item, idx) => `${idx}: ${item[textField]}`).join('\n')}
    
    Return the indices of items that match the query semantically, ordered by relevance.
    Return as a JSON array of numbers, e.g., [2, 0, 5]
    Only include items that are clearly relevant.
  `;
  
  try {
    const response = await generateContent(prompt, true);
    const indices = JSON.parse(response);
    
    return indices.map((idx: number) => items[idx]).filter(Boolean);
  } catch (error) {
    console.error('Semantic search failed:', error);
    // Fallback to simple text search
    const queryLower = query.toLowerCase();
    return items.filter(item => 
      String(item[textField]).toLowerCase().includes(queryLower)
    );
  }
}