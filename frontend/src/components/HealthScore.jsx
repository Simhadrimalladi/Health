import Badge from './Badge.jsx';

function Bar({ label, value }) { 
  return (
    <div className="group">
      <div className="mb-2 flex justify-between text-sm">
        <b className="text-slate-300 group-hover:text-white transition-colors">{label}</b>
        <span className="font-mono text-brand-400 font-bold">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-900 border border-white/5 overflow-hidden">
        <div 
          className="h-full rounded-full bg-brand-gradient transition-all duration-1000 ease-out relative" 
          style={{ width: `${value}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[slideRight_2s_ease-in-out_infinite] transform -skew-x-12"></div>
        </div>
      </div>
    </div>
  ); 
}

export default function HealthScore({ data }) {
  if (!data) return (
    <div className="card-glass p-12 flex flex-col items-center text-center animate-fade-in">
       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <p className="text-lg font-medium text-slate-300">Loading knowledge health score...</p>
    </div>
  );

  return (
    <div className="card-glass p-8 animate-slide-up">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="section-header text-2xl font-black text-white mb-1">
            <div className="section-dot bg-brand-500"></div>
            Knowledge Health Score
          </h2>
          <p className="text-sm text-slate-400">Continuous evaluation of your organization's knowledge graph</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-900 border border-white/10 rounded-2xl p-3 pr-6 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center text-xl font-black">
            {data.scores.overall}
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-300">
            Overall<br/>Score
          </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 mb-10">
        <Bar label="Coverage" value={data.scores.coverage}/>
        <Bar label="Freshness" value={data.scores.freshness}/>
        <Bar label="Balance" value={data.scores.balance}/>
        <Bar label="Consistency" value={data.scores.consistency}/>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Node Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(data.nodeTypeDistribution || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">{type}</span>
                <span className="font-mono text-white bg-white/5 px-2 py-1 rounded">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface-800 border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Coverage by Level
          </h3>
          <div className="space-y-3">
            {Object.entries(data.questionCoverage || {}).map(([level, stats]) => (
              <div key={level} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                <span className="text-slate-400 font-medium">{level}</span>
                <div className="flex gap-4 font-mono text-xs">
                  <span className="text-emerald-400" title="Answered">{stats.answered} ✓</span>
                  <span className="text-slate-500" title="Total">{stats.total} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {data.contradictions?.length > 0 && (
        <div className="mt-8 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
          <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
            <span className="text-lg">⚠</span> Active Contradictions Detected
          </h3>
          <div className="space-y-2">
            {data.contradictions.map((c, i) => (
              <p key={i} className="text-sm text-amber-200/80 leading-relaxed">• {c.topic}: {c.message}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
