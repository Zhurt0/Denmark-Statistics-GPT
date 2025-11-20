import React, { useState } from 'react';
import { Table, Search, Loader2, ExternalLink, Database, FileSearch, ArrowRight } from 'lucide-react';
import { searchVariables } from '../services/geminiService';
import { AiResponse } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const VariableExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    try {
      const response = await searchVariables(searchQuery);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8 pt-8">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
             <Database size={36} />
          </div>
          Variable Browser
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Deep search Danish Statistics (DST) documentation. 
          Enter a variable code (e.g. <code className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">AEL_KOMKOD</code>) or a concept.
        </p>
      </div>

      {/* Search Input Area */}
      <div className="bg-white p-4 rounded-2xl shadow-lg shadow-indigo-900/5 border border-indigo-100 max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2 relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={24} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter variable code or name (e.g. 'AEL_KOMKOD', 'SOC_STATUS')"
                className="w-full pl-14 pr-4 py-3.5 rounded-xl outline-none text-lg text-slate-700 placeholder:text-slate-300 font-medium"
            />
            <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
            </button>
        </form>
        
        {/* Quick Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm px-2">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mr-1">Quick Try:</span>
            <button onClick={() => executeSearch('AEL_KOMKOD')} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-full border border-slate-200 transition-colors font-mono text-xs">
                AEL_KOMKOD
            </button>
             <button onClick={() => executeSearch('SOC_STATUS')} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-full border border-slate-200 transition-colors font-mono text-xs">
                SOC_STATUS
            </button>
             <button onClick={() => executeSearch('hospital diagnosis ICD-10')} className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-full border border-slate-200 transition-colors text-xs">
                Hospital Diagnosis
            </button>
        </div>
      </div>

      {/* Results Area */}
      {result && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[300px]">
          <div className="p-8">
            <div className="prose prose-indigo prose-lg max-w-none 
                prose-table:w-full prose-table:border-collapse prose-table:text-sm 
                prose-th:bg-slate-50 prose-th:text-slate-700 prose-th:font-bold prose-th:p-4 prose-th:text-left prose-th:border-b prose-th:border-slate-200
                prose-td:p-4 prose-td:border-b prose-td:border-slate-100 prose-td:text-slate-600
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">{props.children} <ExternalLink size={12} /></a>
                }}
              >
                {result.text}
              </ReactMarkdown>
            </div>

            {result.sources.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Sources Found</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group bg-slate-50/30"
                    >
                      <div className="mt-1 min-w-4 w-4">
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="block text-sm font-medium text-indigo-900 group-hover:text-indigo-700 truncate">
                            {source.title}
                        </span>
                        <span className="block text-xs text-slate-500 truncate mt-0.5">
                            {source.uri}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State / Tips */}
      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <FileSearch size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Search Strategy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    This tool searches the "Times" documentation and "Forskningvariabellister" on dst.dk. 
                    It works best when you search for specific <strong>variable codes</strong> (e.g. <span className="font-mono text-slate-800">ALDER</span>, <span className="font-mono text-slate-800">CIVST</span>) or official module names.
                </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Database size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Popular Modules</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><ArrowRight size={12} className="text-green-500" /> <span className="font-medium">Social Statistics (Sociale forhold)</span></li>
                    <li className="flex items-center gap-2"><ArrowRight size={12} className="text-green-500" /> <span className="font-medium">Health (Landspatientregisteret)</span></li>
                    <li className="flex items-center gap-2"><ArrowRight size={12} className="text-green-500" /> <span className="font-medium">Labor Market (IDAN/RAS)</span></li>
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default VariableExplorer;