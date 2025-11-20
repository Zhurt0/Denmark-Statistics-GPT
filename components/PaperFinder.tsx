import React, { useState } from 'react';
import { BookOpenCheck, ExternalLink, Loader2, Search, BookMarked, GraduationCap } from 'lucide-react';
import { findRelatedPapers } from '../services/geminiService';
import { AiResponse } from '../types';
import ReactMarkdown from 'react-markdown';

interface PaperFinderProps {
  registryName?: string;
}

const PaperFinder: React.FC<PaperFinderProps> = ({ registryName }) => {
  const [topic, setTopic] = useState('');
  const [customRegistry, setCustomRegistry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const isGlobal = !registryName;

  const handleFindPapers = async () => {
    const targetRegistry = registryName || customRegistry;
    // For global search, if they haven't typed a registry, we search for general Danish admin data papers
    const effectiveRegistry = targetRegistry || "Administrative Data"; 

    setLoading(true);
    try {
      const response = await findRelatedPapers(effectiveRegistry, topic);
      setResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="text-teal-700" size={24} />
            <h3 className="text-lg font-bold text-slate-800">
                {isGlobal ? 'Academic Literature Search' : 'Literature Review'}
            </h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
            {isGlobal 
                ? 'Search for high-impact economics papers (AEA, NBER, CEPR) using Danish data.' 
                : `Find top-tier economics papers using the ${registryName} registry.`
            }
        </p>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <div className="flex flex-col md:flex-row gap-3">
                 {isGlobal && (
                     <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Dataset (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Population Register" 
                            className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                            value={customRegistry}
                            onChange={(e) => setCustomRegistry(e.target.value)}
                        />
                     </div>
                 )}
                 <div className="flex-[2]">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Research Topic / Keyword</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="e.g. 'labor supply', 'crime', 'education'" 
                            className="flex-1 text-sm px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <button
                            onClick={handleFindPapers}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold rounded-md transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                            Search
                        </button>
                    </div>
                 </div>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <span>Searching:</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">AEA (aeaweb.org)</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">NBER</span>
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">CEPR</span>
            </div>
        </div>
      </div>

      <div className="p-6 min-h-[200px]">
        {!result && !loading && (
          <div className="text-center py-8 text-slate-400">
            <BookMarked className="mx-auto mb-3 opacity-20" size={40} />
            <p className="font-medium">No results yet.</p>
            <p className="text-sm mt-1">Enter a topic to find NBER/AEA working papers.</p>
          </div>
        )}

        {loading && (
           <div className="space-y-6 animate-pulse max-w-3xl mx-auto py-4">
              {[1, 2].map(i => (
                  <div key={i} className="space-y-3">
                      <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                      <div className="h-16 bg-slate-50 rounded w-full"></div>
                  </div>
              ))}
           </div>
        )}

        {result && (
          <div className="animate-in fade-in duration-500">
            <div className="prose prose-sm max-w-none text-slate-700 prose-headings:text-teal-900 prose-headings:font-bold prose-a:text-teal-700 prose-a:font-semibold prose-strong:text-slate-900">
              <ReactMarkdown components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 no-underline hover:underline">{props.children} <ExternalLink size={12} /></a>
              }}>
                  {result.text}
              </ReactMarkdown>
            </div>

            {result.sources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((source, i) => (
                    <a 
                        key={i}
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white border border-slate-200 rounded-full hover:border-teal-300 hover:shadow-sm transition-all group"
                      >
                        <img 
                            src={`https://www.google.com/s2/favicons?domain=${new URL(source.uri).hostname}`} 
                            alt="" 
                            className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" 
                        />
                        <span className="text-xs text-slate-600 group-hover:text-teal-700 truncate max-w-[250px]">
                          {source.title}
                        </span>
                      </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperFinder;