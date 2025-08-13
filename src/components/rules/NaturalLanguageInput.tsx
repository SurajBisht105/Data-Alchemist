import { useState } from 'react';
import { convertNaturalLanguageToRule } from '@/lib/ai/rule-converter';
import { Rule } from '@/types/rules.types';

interface Props {
  onRuleCreated: (rule: Rule) => void;
  onClose: () => void;
}

export default function NaturalLanguageInput({ onRuleCreated, onClose }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Rule | null>(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const rule = await convertNaturalLanguageToRule(input);
      setPreview(rule);
    } catch (err) {
      setError('Failed to understand the rule. Please try rephrasing.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (preview) {
      onRuleCreated(preview);
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Create Rule with Natural Language</h3>
        <p className="text-sm text-gray-600">
          Describe your rule in plain English. For example:
        </p>
        <ul className="text-sm text-gray-500 mt-2 space-y-1">
          <li>• "Tasks T12 and T14 must always run together"</li>
          <li>• "Sales workers can only handle 3 tasks per phase"</li>
          <li>• "High priority clients should be served in phases 1-3"</li>
        </ul>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your rule here..."
        className="w-full p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}

      {preview && (
        <div className="mt-4 p-4 bg-white rounded-lg border">
          <h4 className="font-medium mb-2">Rule Preview</h4>
          <pre className="text-sm bg-gray-50 p-2 rounded">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        {!preview ? (
          <button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert to Rule'}
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Apply Rule
          </button>
        )}
      </div>
    </div>
  );
}