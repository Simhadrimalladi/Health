import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import UserSelector from '../components/UserSelector.jsx';
import PatientSelector from '../components/PatientSelector.jsx';
import Badge from '../components/Badge.jsx';

export default function Dashboard({ users, patients, userId, setUserId, patientId, setPatientId, onTab }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => { 
    if (userId) {
      Promise.all([
        api.relevantQuestions(userId), 
        api.health(userId), 
        api.nodes()
      ])
      .then(([q, h, n]) => setSummary({ q, h, n }))
      .catch(console.error); 
    }
  }, [userId]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-glass p-6">
        <h2 className="section-header text-xl font-bold text-white mb-6">
          <div className="section-dot bg-brand-500"></div>
          Simulation Context
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <UserSelector users={users} value={userId} onChange={setUserId} />
          <PatientSelector patients={patients} value={patientId} onChange={setPatientId} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Applicable questions', summary?.q?.progress?.totalApplicable], 
          ['Answered', summary?.q?.progress?.answeredCount], 
          ['Knowledge nodes', summary?.n?.length], 
          ['Health score', summary?.h?.scores?.overall ? `${summary.h.scores.overall}%` : '-']
        ].map(([k, v]) => (
          <div className="stat-card" key={k}>
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">{k}</div>
            <div className="mt-1 text-4xl font-black text-white">{v ?? '-'}</div>
          </div>
        ))}
      </div>

      <div className="card-glass p-6 md:p-8">
        <h2 className="section-header text-2xl font-bold text-white">
          <div className="section-dot bg-brand-400"></div>
          Evaluation Flow
        </h2>
        <p className="mt-2 text-slate-300 leading-relaxed max-w-3xl">
          Use <span className="font-semibold text-brand-300">Onboarding</span> to experience the multi-level question targeting and answer-to-node conversion. 
          Use <span className="font-semibold text-brand-300">Session</span> to see the unified context pipeline in action with the AI. 
          Use <span className="font-semibold text-brand-300">Comparison</span> to measure the quality gap between empty AI and organization-aware AI.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Onboarding', 'Session', 'Comparison', 'Health', 'Admin'].map(t => (
            <button className="btn-secondary" key={t} onClick={() => onTab(t)}>
              {t === 'Session' && <span className="text-brand-400">✨</span>}
              Launch {t}
            </button>
          ))}
        </div>
        
        <div className="divider my-6"></div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mr-2">System Capacity</span>
          <Badge tone="brand">30 questions</Badge>
          <Badge tone="blue">4 levels</Badge>
          <Badge tone="red">P0 mandatory</Badge>
          <Badge tone="purple">4,000 token budget</Badge>
        </div>
      </div>
    </div>
  );
}
