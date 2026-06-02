import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import Badge from './Badge.jsx';
export default function KnowledgeGraph() {
  const [nodes, setNodes] = useState([]); const [type, setType] = useState('');
  useEffect(() => { api.nodes(type ? { type } : undefined).then(setNodes).catch(console.error); }, [type]);
  return <div className="card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Knowledge Graph</h2><select className="input max-w-xs" value={type} onChange={e=>setType(e.target.value)}><option value="">All types</option><option>CONSTRAINT</option><option>DECISION</option><option>ANTI_PATTERN</option><option>FACT</option></select></div><div className="grid gap-3 md:grid-cols-2">{nodes.map(n=><div key={n.id} className="rounded-xl border p-3"><div className="mb-1 flex gap-1"><Badge>{n.type}</Badge><Badge>{n.department || 'global'}</Badge><Badge>{n.sourceType}</Badge></div><b>{n.title}</b><p className="text-sm text-slate-600">{n.content}</p></div>)}</div></div>;
}
