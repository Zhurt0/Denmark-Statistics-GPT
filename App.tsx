import React from 'react';
import { HashRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import { REGISTRIES } from './data/staticData';
import { ArrowRight, Table, FileText, Database, Info } from 'lucide-react';
import AiAssistant from './components/AiAssistant';
import PaperFinder from './components/PaperFinder';
import VariableExplorer from './components/VariableExplorer';
import ReactMarkdown from 'react-markdown';

// --- Views ---

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to DanData Hub</h1>
        <p className="text-indigo-100 max-w-2xl text-lg leading-relaxed">
          The premier explorer for Danish Statistics (DST) micro-data registries. 
          Navigate variable lists, access official documentation, and discover relevant economic literature powered by AI.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/registries" className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
            Explore Registries <ArrowRight size={18} />
          </Link>
          <a href="https://www.dst.dk/extranet/forskningvariabellister/Oversigt%20over%20registre.html" target="_blank" rel="noreferrer" className="px-6 py-3 bg-indigo-700/50 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors border border-indigo-500/30">
            Official List
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/registries" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
            <Database size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Comprehensive Data</h3>
          <p className="text-slate-600 text-sm">Access details on population, labor, health, and education registries covering the entire Danish population.</p>
        </Link>
        
        <Link to="/literature" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-teal-300 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-100 group-hover:scale-110 transition-all">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Literature Search</h3>
          <p className="text-slate-600 text-sm">Find academic papers and economic studies that utilize specific datasets for your research.</p>
        </Link>

        <Link to="/variables" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
            <Table size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Variable Browser</h3>
          <p className="text-slate-600 text-sm">Drill down into key variables like income (IND), employment (IDAN), and demographics.</p>
        </Link>
      </div>
    </div>
  );
};

const RegistryList = () => {
  const [search, setSearch] = React.useState('');
  
  const filtered = REGISTRIES.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Registries</h2>
          <p className="text-slate-500">Browse available Danish administrative datasets.</p>
        </div>
        <div className="relative">
           <input 
             type="text" 
             placeholder="Search registries..." 
             className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
           <div className="absolute left-3 top-2.5 text-slate-400">
             <Info size={18}/>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((registry) => (
          <Link 
            key={registry.id} 
            to={`/registries/${registry.id}`}
            className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wide">
                {registry.code}
              </span>
              <span className="text-xs text-slate-400 font-medium">{registry.category}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
              {registry.name}
            </h3>
            <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-1">
              {registry.description}
            </p>
            <div className="flex items-center text-indigo-600 text-sm font-medium mt-auto">
              View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const RegistryDetail = () => {
  const { id } = useParams();
  const registry = REGISTRIES.find(r => r.id === id);

  if (!registry) return <div>Registry not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link to="/registries" className="text-slate-500 hover:text-slate-800 text-sm">Registries</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium text-sm">{registry.code}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          {registry.name} <span className="text-slate-400 font-light">({registry.code})</span>
        </h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
            {registry.category}
          </span>
          <a 
            href={registry.documentationUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-3 py-1 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 rounded-full text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Official Docs <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Description & Variables */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed">
              {registry.description}
            </p>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Key Variables</h2>
              <Link to="/variables" className="text-xs text-indigo-600 font-medium hover:underline">
                 Search All Variables
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">Variable</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {registry.keyVariables.map((v, idx) => (
                    <tr key={idx} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-indigo-600 font-medium">{v.name}</td>
                      <td className="px-6 py-4">{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-xs text-slate-500">
                * This is a subset of key variables. Use the AI Assistant to find specific ones.
              </p>
            </div>
          </section>

          {/* Example Papers Static */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <h2 className="text-xl font-bold text-slate-800 mb-4">Featured Research</h2>
             <div className="space-y-4">
                {registry.papers.length > 0 ? registry.papers.map((paper, idx) => (
                   <div key={idx} className="border border-slate-100 rounded-lg p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                      <h4 className="font-bold text-slate-800 mb-1">{paper.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{paper.authors} ({paper.year}) - <span className="italic">{paper.journal}</span></p>
                      <a href={paper.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                         Read Paper <ArrowRight size={12} />
                      </a>
                   </div>
                )) : (
                  <p className="text-slate-500 italic">No featured papers listed yet. Use the Literature Review tool below.</p>
                )}
             </div>
          </section>
          
          {/* Dynamic Paper Search */}
          <PaperFinder registryName={registry.name} />
        </div>

        {/* Right Col: AI Tools */}
        <div className="lg:col-span-1">
           <div className="sticky top-6">
              <AiAssistant registryCode={registry.code} registryName={registry.name} />
              
              <div className="mt-6 bg-slate-900 rounded-xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Access Data</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Access to these registries typically requires affiliation with a Danish research institution and approval from DST.
                </p>
                <a 
                  href="https://www.dst.dk/en/TilSalg/Forskningsservice" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full py-2 text-center bg-white text-slate-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                >
                  Research Services Guide
                </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LiteratureSearch = () => (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Literature Search</h1>
            <p className="text-slate-600">
                Discover academic research and economics papers that utilize Danish administrative data.
                Search by specific registry or broader research topics.
            </p>
        </div>
        <PaperFinder />
    </div>
)

const Resources = () => (
    <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Resources</h1>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 prose prose-slate">
            <h3>Official Links</h3>
            <ul>
                <li><a href="https://www.dst.dk/extranet/forskningvariabellister/Oversigt%20over%20registre.html" target="_blank" rel="noreferrer">DST Registry Overview</a> - Complete list of variables.</li>
                <li><a href="https://www.dst.dk/en/TilSalg/Forskningsservice" target="_blank" rel="noreferrer">Research Services</a> - How to apply for access.</li>
                <li><a href="https://www.aeaweb.org/articles?id=10.1257/app.20170604" target="_blank" rel="noreferrer">Example Economics Paper</a> - "Childhood exposure to crime" (AEA).</li>
            </ul>
            <h3>About this App</h3>
            <p>
                This application is designed to help researchers navigate the complex landscape of Danish administrative data. 
                It uses <strong>Google Gemini 2.5</strong> to provide intelligent summaries and find relevant academic literature dynamically.
            </p>
            <p>
                <strong>Note:</strong> This is a demo application. Always verify variable definitions with official DST documentation.
            </p>
        </div>
    </div>
)

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/registries" element={<RegistryList />} />
          <Route path="/registries/:id" element={<RegistryDetail />} />
          <Route path="/variables" element={<VariableExplorer />} />
          <Route path="/literature" element={<LiteratureSearch />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;