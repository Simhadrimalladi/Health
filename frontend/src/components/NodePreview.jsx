import Badge from './Badge.jsx';

export default function NodePreview({ result }) {
  if (!result?.node) return null;
  const n = result.node;
  
  return (
    <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse-slow"></div>
        <h4 className="text-sm font-bold text-white tracking-wide uppercase">Node Successfully Generated</h4>
      </div>
      
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone="green">Stored in knowledge_nodes</Badge>
        <Badge tone="blue">{n.type}</Badge>
        <Badge>Imp: {n.importance}</Badge>
        <Badge>QID: {n.sourceQuestionId}</Badge>
      </div>
      
      <div className="rounded-lg bg-surface-950 p-4 border border-white/5 mb-4">
        <div className="font-bold text-white mb-1.5">{n.title}</div>
        <p className="text-sm text-slate-300 leading-relaxed">{n.content}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex flex-col"><span className="text-slate-500 font-semibold mb-0.5">Hierarchy</span><span className="text-slate-200">{n.hierarchyLevelId}</span></div>
        <div className="flex flex-col"><span className="text-slate-500 font-semibold mb-0.5">Department</span><span className="text-slate-200">{n.department || 'Hospital-wide'}</span></div>
        <div className="flex flex-col"><span className="text-slate-500 font-semibold mb-0.5">Derivability</span><span className="text-slate-200">{n.derivabilityScore}</span></div>
        <div className="flex flex-col"><span className="text-slate-500 font-semibold mb-0.5">Decay Profile</span><span className="text-slate-200">{n.decayProfile}</span></div>
      </div>
      
      {result.audit?.warning && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
          <span className="text-lg leading-none">⚠</span>
          <p>{result.audit.warning}</p>
        </div>
      )}
    </div>
  );
}
