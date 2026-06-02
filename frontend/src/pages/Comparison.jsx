import { useState } from 'react';
import { api } from '../lib/api.js';
import { DEFAULT_QUERY } from '../lib/constants.js';
import ThreeLevelCompare from '../components/ThreeLevelCompare.jsx';

export default function Comparison({ userId, patientId }) {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false);
  
  async function run() { 
    setLoading(true); 
    try { 
      setData(await api.comparison({ userId, patientId, query: DEFAULT_QUERY })); 
    } finally { 
      setLoading(false); 
    } 
  }
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="card-glass p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="section-header text-2xl font-black text-white mb-2">
              <div className="section-dot bg-brand-400"></div>
              Three-Level Quality Comparison
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Same query, three context levels. Level 3 should inject organizational knowledge (e.g. Padma-specific meds and Ekadashi).
            </p>
          </div>
          <button className="btn-primary shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.3)]" onClick={run} disabled={loading}>
            {loading ? (
              <><svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running Evaluation...</>
            ) : 'Run AI Comparison'}
          </button>
        </div>
      </div>
      
      <ThreeLevelCompare data={data} />
    </div>
  );
}
