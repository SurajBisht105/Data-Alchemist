import { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { generateAIRules } from '@/lib/ai/rule-recommendations';
import { Rule } from '@/types/rules.types';
import { useRules } from '@/hooks/useRules';

export default function AISuggestions() {
  const [suggestions, setSuggestions] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Get data directly from store
  const { clients, workers, tasks, hasData } = useDataStore();
  const { addRule } = useRules();

  const fetchSuggestions = async () => {
    // Check if data exists
    if (!hasData || (!clients.length && !workers.length && !tasks.length)) {
      setError('No data available for AI suggestions');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Create proper data structure
      const data = {
        clients,
        workers,
        tasks,
        hasData
      };
      
      const rules = await generateAIRules(data);
      setSuggestions(rules);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const acceptSuggestion = (rule: Rule) => {
    addRule(rule);
    setSuggestions(suggestions.filter(s => s.id !== rule.id));
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (suggestions.length === 0 && hasData && !error) {
      fetchSuggestions();
    }
  };

  // Don't render if no data
  if (!hasData) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="bg-purple-600 text-white rounded-full p-4 shadow-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
        >
          <span className="text-xl">✨</span>
          <span>AI Suggestions</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">AI Rule Suggestions</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Analyzing patterns...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={fetchSuggestions}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Try Again
              </button>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">
                        {suggestion.type.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {suggestion.description}
                      </p>
                      {suggestion.confidence !== undefined && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${(suggestion.confidence || 0) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {Math.round((suggestion.confidence || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => acceptSuggestion(suggestion)}
                      className="ml-3 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No suggestions available</p>
              <button
                onClick={fetchSuggestions}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Generate Suggestions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
