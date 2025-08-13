import { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { searchWithNaturalLanguage } from '@/lib/ai/natural-language-search';

export default function AISearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get data directly from store
  const { clients, workers, tasks, hasData } = useDataStore();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Check if data exists
    if (!hasData || (!clients.length && !workers.length && !tasks.length)) {
      setError('No data available to search');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create data object with proper structure
      const data = {
        clients,
        workers,
        tasks,
        hasData
      };
      
      const searchResults = await searchWithNaturalLanguage(query, data);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search using natural language (e.g., 'All tasks with duration > 1 phase')"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading || !hasData}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim() || !hasData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Search Results ({results.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((item, idx) => (
              <div key={idx} className="p-3 bg-white rounded border hover:shadow-sm">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!hasData && (
        <div className="mt-2 text-sm text-gray-500">
          Upload data first to enable search
        </div>
      )}
    </div>
  );
}