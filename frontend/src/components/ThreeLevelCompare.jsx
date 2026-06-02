import Badge from './Badge.jsx';

export default function ThreeLevelCompare({ data }) {
  if (!data) return (
    <div className="card-glass p-12 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Comparison Engine Ready</h3>
      <p className="text-slate-400 max-w-md">Run the comparison to measure the quality gap between empty AI, basic profile AI, and full organizational context AI.</p>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3 animate-slide-up mt-6">
      {data.levels.map((level, idx) => {
        const isBest = level.level === 3;
        
        return (
          <div className={`card relative overflow-hidden transition-all duration-300 ${
            isBest ? 'border-brand-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] transform lg:-translate-y-2' : 'border-white/5 hover:border-white/20'
          }`} key={level.level}>
            
            {isBest && (
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-gradient"></div>
            )}
            
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge tone={isBest ? 'brand' : 'slate'}>Level {level.level}</Badge>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-400">Score</span>
                  <span className={`text-xl font-black ${isBest ? 'text-brand-400' : 'text-white'}`}>{level.score}/5</span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-5 min-h-[56px] flex items-center">{level.name}</h4>
              
              <div className="space-y-2 mb-6 text-sm">
                {Object.entries(level.included).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    {v ? (
                      <svg className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mt-0.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={v ? 'text-slate-200' : 'text-slate-500 line-through decoration-slate-700'}>{k}</span>
                  </div>
                ))}
              </div>
              
              <div className={`rounded-xl p-4 text-sm leading-relaxed mb-4 ${
                isBest ? 'bg-brand-500/10 border border-brand-500/20 text-brand-50' : 'bg-surface-900 border border-white/5 text-slate-300'
              }`}>
                {level.response}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Tokens: <span className="text-slate-300">{level.tokenUsage}</span></span>
                <span>Nodes: <span className="text-slate-300">{level.nodeCounts?.selected || 0}</span></span>
              </div>
            </div>
            
            {isBest && (
              <div className="absolute top-4 right-4 animate-pulse-slow">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
