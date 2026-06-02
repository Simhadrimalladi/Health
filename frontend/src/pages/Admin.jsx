import { useState } from 'react';
import AdminSurpriseQuestion from '../components/AdminSurpriseQuestion.jsx';
import ContextPanel from '../components/ContextPanel.jsx';
import { api } from '../lib/api.js';

export default function Admin() { 
  const [session, setSession] = useState(null); 
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  async function month12() { 
    setLoading(true);
    setStatus('Running month-12 seed...'); 
    try {
      const r = await api.simulateMonth12(); 
      setStatus(r.message || 'Simulation complete'); 
    } catch (e) {
      setStatus('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  } 
  
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_500px] max-w-[1600px] mx-auto animate-fade-in h-full">
      <div className="space-y-6">
        <AdminSurpriseQuestion onSessionResult={setSession} />
        
        <div className="card-glass p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="section-header text-xl font-bold text-white mb-2">
                <div className="section-dot bg-brand-500"></div>
                Month-12 Scalability Test
              </h2>
              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Adds 500 simulated nodes to the database. The Rules Engine ensures we still filter only to relevant candidates, and the context composer remains under budget.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            <button className="btn-secondary" onClick={month12} disabled={loading}>
              {loading ? 'Simulating 500 nodes...' : 'Run 500-node simulation'}
            </button>
            {status && <span className="text-sm font-semibold text-emerald-400">{status}</span>}
          </div>
        </div>
      </div>
      
      <ContextPanel data={session} />
    </div>
  ); 
}
