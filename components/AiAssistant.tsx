import React, { useState } from 'react';
import { Sparkles, Search, ExternalLink, Loader2 } from 'lucide-react';
import { explainRegistryContext } from '../services/geminiService';
import { AiResponse } from '../types';
import ReactMarkdown from 'react-markdown';

interface AiAssistantProps {
  registryCode: string;
  registryName: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ registryCode, registryName }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AiResponse | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await explainRegistryContext(registryCode, query);
      setResponse(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-indigo-600" size={20} />
        <h3 className="text-lg font-semibold text-indigo-900">AI Research Assistant</h3>
      </div>
      <p className="text-indigo-700/80 text-sm mb-4">
        Ask questions about the <strong>{registryName}</strong> ({registryCode}) registry. Find specific variable names, years of coverage, or research potential.
      </p>

      <form onSubmit={handleAsk} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`e.g., "Does ${registryCode} include data on self-employment?"`}
          className="w-full pl-4 pr-12 py-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/80 backdrop-blur-sm transition-all"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
        </button>
      </form>

      {response && (
        <div className="mt-6 bg-white rounded-lg p-5 border border-indigo-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="prose prose-sm prose-indigo max-w-none text-slate-700">
            <ReactMarkdown>{response.text}</ReactMarkdown>
          </div>
          
          {response.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Sources</p>
              <div className="flex flex-wrap gap-2">
                {response.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors border border-slate-200"
                  >
                    {source.title.slice(0, 30)}{source.title.length > 30 ? '...' : ''}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiAssistant;