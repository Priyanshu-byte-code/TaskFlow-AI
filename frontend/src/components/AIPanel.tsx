import { useState } from 'react';
import api from '../services/api';
import { AISuggestion } from '../types';

interface Props { projectId: string; sprintEnd: string; }

const AIPanel = ({ projectId, sprintEnd }: Props) => {
  const [suggestions, setSuggestions] = useState<AISuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ai/prioritize', { projectId, sprintEnd });
      setSuggestions(data);
    } catch {
      setError('AI analysis failed. Check your OpenAI API key.');
    } finally {
      setLoading(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;
    setAskLoading(true);
    try {
      const { data } = await api.post('/ai/ask', { question, context: `Project ID: ${projectId}` });
      setAnswer(data.answer);
      setQuestion('');
    } catch {
      setAnswer('Failed to get response.');
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="w-56 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span className="text-xs font-medium text-gray-700">AI assistant</span>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="text-xs bg-purple-600 text-white rounded-lg px-2 py-2 hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? 'Analyzing sprint...' : 'Analyze sprint'}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {suggestions && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-2.5">
            <p className="text-xs text-gray-400 mb-1 font-medium">Priority alert</p>
            <p className="text-xs text-gray-700 leading-relaxed">{suggestions.priorityAlert}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2.5">
            <p className="text-xs text-gray-400 mb-1 font-medium">Sprint risk</p>
            <p className="text-xs text-gray-700 leading-relaxed">{suggestions.sprintRisk}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-2.5">
            <p className="text-xs text-gray-400 mb-1 font-medium">Suggested task</p>
            <p className="text-xs text-gray-700 leading-relaxed">{suggestions.suggestedTask}</p>
          </div>
          {suggestions.recommendation && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-2.5">
              <p className="text-xs text-purple-400 mb-1 font-medium">Recommendation</p>
              <p className="text-xs text-purple-700 leading-relaxed">{suggestions.recommendation}</p>
            </div>
          )}
        </>
      )}

      <div className="border-t border-gray-200 pt-2 mt-auto">
        <p className="text-xs text-gray-400 mb-1.5 font-medium">Ask AI</p>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI(); } }}
          placeholder="Summarize blockers..."
          rows={2}
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-300 bg-white resize-none"
        />
        <button
          onClick={askAI}
          disabled={askLoading || !question.trim()}
          className="mt-1.5 w-full text-xs bg-purple-600 text-white rounded-lg py-1.5 hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
        >
          {askLoading ? 'Thinking...' : 'Ask'}
        </button>
        {answer && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg p-2">
            <p className="text-xs text-gray-600 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
