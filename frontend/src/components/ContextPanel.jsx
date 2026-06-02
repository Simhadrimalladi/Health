import Badge from './Badge.jsx';

function NodeCard({ node }) {
  const isConstraint = node.type === 'CONSTRAINT';
  const typeClass = isConstraint ? 'type-constraint' : 
                    node.type === 'DECISION' ? 'type-decision' : 
                    node.type === 'ANTI_PATTERN' ? 'type-antipattern' : 'type-fact';

  return (
    <div className={`rounded-xl border bg-white/5 p-4 text-sm shadow-sm transition-all hover:bg-white/10 ${typeClass}`}>
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <span className="text-[10px] font-black tracking-widest uppercase">{node.type}</span>
        <div className="h-1 w-1 rounded-full bg-current opacity-30"></div>
        <span className="text-xs opacity-80">{node.sourceType}</span>
        {node.sourceQuestionId && (
          <>
            <div className="h-1 w-1 rounded-full bg-current opacity-30"></div>
            <span className="text-xs opacity-80 font-medium">From {node.sourceQuestionId}</span>
          </>
        )}
      </div>
      <div className="font-bold text-slate-100 mb-1.5">{node.title}</div>
      <p className="text-slate-300 leading-relaxed text-xs opacity-90">{node.content}</p>
      
      {node.rulesPass && (
        <div className="mt-3 flex items-center gap-1.5 opacity-60">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider font-semibold">Rules pass: org, dept, hierarchy, active, deriv, patient</span>
        </div>
      )}
    </div>
  );
}

export default function ContextPanel({ data }) {
  if (!data) return (
    <div className="card-glass p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Awaiting Context</h3>
      <p className="text-sm text-slate-400 max-w-[250px]">Run a session to view the nodes injected by the Rules Engine.</p>
    </div>
  );

  const nodes = data.selectedNodes || [];
  const tokenUsedPct = Math.min(100, (data.tokenUsage / data.tokenBudget) * 100);
  const isBudgetWarning = data.tokenUsage > data.tokenBudget * 0.9;

  return (
    <aside className="card-solid flex flex-col max-h-[calc(100vh-120px)] animate-slide-in">
      <div className="p-5 border-b border-white/10 shrink-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow"></div>
              Injected Context
            </h3>
            <p className="text-xs text-brand-300/80 mt-1">{nodes.length} nodes from unified pipeline</p>
          </div>
          <Badge tone={data.tokenUsage <= data.tokenBudget ? 'brand' : 'red'}>
            {data.tokenUsage} / {data.tokenBudget} tkns
          </Badge>
        </div>
        
        {/* Token progress bar */}
        <div className="progress-track mb-5">
          <div 
            className={`progress-fill ${isBudgetWarning ? 'bg-red-500' : 'bg-brand-500'}`} 
            style={{ width: `${tokenUsedPct}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 transition-colors hover:bg-white/10">
            <b className="text-lg text-white block mb-0.5">{data.counts?.bySource?.QUESTION || 0}</b>
            <span className="text-slate-400 font-medium">Question</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 transition-colors hover:bg-white/10">
            <b className="text-lg text-white block mb-0.5">{data.counts?.bySource?.PATIENT || 0}</b>
            <span className="text-slate-400 font-medium">Patient</span>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3 transition-colors hover:bg-white/10">
            <b className="text-lg text-white block mb-0.5">{data.counts?.bySource?.PRE_EXISTING || 0}</b>
            <span className="text-slate-400 font-medium">Pre-existing</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-4">
        {data.excludedSummary?.orthoExcludedForAnanya && (
          <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 p-4 text-sm text-brand-200 flex gap-3 items-start">
            <svg className="w-5 h-5 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Ortho department nodes were properly excluded for Medicine user Dr. Ananya.</p>
          </div>
        )}
        
        <div className="space-y-3">
          {nodes.map(n => <NodeCard key={n.id} node={n} />)}
        </div>
        
        <details className="mt-6 group">
          <summary className="cursor-pointer font-semibold text-sm text-slate-300 hover:text-white flex items-center gap-2 outline-none">
            <span className="group-open:rotate-90 transition-transform">▶</span> 
            View raw 8-block context string
          </summary>
          <div className="mt-3 code-block">
            {data.contextString}
          </div>
        </details>
      </div>
    </aside>
  );
}
