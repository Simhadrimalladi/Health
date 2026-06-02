import { useState } from 'react';
import { api } from '../lib/api.js';
import NodePreview from './NodePreview.jsx';

export default function AdminSurpriseQuestion({ onSessionResult }) {
  const [question, setQuestion] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [form, setForm] = useState({ 
    questionText: 'What infection control measures does Supra require for all invasive procedures?', 
    typeHint: 'CONSTRAINT', 
    level: 'HOSPITAL', 
    priority: 0, 
    targetHierarchyLevel: 'HL-GLOBAL', 
    importanceDefault: 0.94 
  });
  const [answerText, setAnswerText] = useState('Full sterile technique mandatory for every invasive procedure including IV cannulation, catheterization and lumbar puncture. No shortcuts.');
  const [status, setStatus] = useState('');

  async function add() { 
    const data = await api.addQuestion(form); 
    setQuestion(data); 
    setStatus('Question added successfully. Awaiting answer.'); 
  }
  
  async function answer() { 
    if (!question?.id) return; 
    const data = await api.answerAdminQuestion(question.id, { userId: 'U-MEERA', answerText }); 
    setAnswerResult(data); 
    setStatus('Answer processed. Node created by Dr. Meera.'); 
  }
  
  async function run() { 
    const data = await api.session({ 
      userId: 'U-ANANYA', 
      patientId: 'PAT-PADMA', 
      message: "What should I consider for Mrs. Padma's medication during her Ekadashi fast? Include relevant infection control rules." 
    }); 
    onSessionResult?.(data); 
    setStatus('Session ran as Dr. Ananya. Pipeline injected the new node automatically.'); 
  }

  return (
    <div className="card-glass p-6 md:p-8 space-y-8 animate-slide-up">
      <div>
        <h2 className="section-header text-xl font-bold text-white mb-2">
          <div className="section-dot bg-brand-500"></div>
          Surprise Question Test (End-to-End Flow)
        </h2>
        <p className="text-sm text-slate-400">
          Inject a new question into the system, answer it as Dr. Meera, and watch it immediately affect Dr. Ananya's next AI session through the universal knowledge pipeline.
        </p>
      </div>

      <div className="space-y-4 bg-surface-900/50 p-6 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Step 1: Admin Adds Question</h3>
          <span className="text-[10px] bg-brand-500/20 text-brand-400 px-2 py-1 rounded font-bold uppercase">Simulated</span>
        </div>
        
        <input className="input text-lg font-medium" value={form.questionText} onChange={e => setForm({ ...form, questionText: e.target.value })} />
        
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="label">Type</label>
            <select className="select" value={form.typeHint} onChange={e => setForm({ ...form, typeHint: e.target.value })}>
              <option className="bg-surface-800">CONSTRAINT</option>
              <option className="bg-surface-800">DECISION</option>
              <option className="bg-surface-800">ANTI_PATTERN</option>
              <option className="bg-surface-800">FACT</option>
            </select>
          </div>
          <div>
            <label className="label">Level</label>
            <select className="select" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
              <option className="bg-surface-800">HOSPITAL</option>
              <option className="bg-surface-800">DEPARTMENT</option>
              <option className="bg-surface-800">ROLE</option>
              <option className="bg-surface-800">COHORT</option>
            </select>
          </div>
          <div>
            <label className="label">Hierarchy</label>
            <input className="input" value={form.targetHierarchyLevel} onChange={e => setForm({ ...form, targetHierarchyLevel: e.target.value })}/>
          </div>
          <div>
            <label className="label">Priority (0-3)</label>
            <input className="input" type="number" min="0" max="3" value={form.priority} onChange={e => setForm({ ...form, priority: Number(e.target.value) })}/>
          </div>
        </div>
        
        <button className="btn-secondary w-full sm:w-auto" onClick={add}>Generate Question Entity</button>
      </div>

      {question && (
        <div className="space-y-4 bg-surface-900/50 p-6 rounded-2xl border border-white/5 animate-fade-in border-l-2 border-l-brand-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">Step 2: Dr. Meera Answers</h3>
            <span className="text-[10px] bg-brand-500/20 text-brand-400 px-2 py-1 rounded font-bold uppercase">Simulated</span>
          </div>
          <textarea className="input min-h-[100px] resize-y" value={answerText} onChange={e => setAnswerText(e.target.value)} />
          <button className="btn-primary" onClick={answer}>Submit Answer → Generate Node</button>
        </div>
      )}

      {answerResult && (
        <div className="space-y-6 animate-fade-in">
          <NodePreview result={answerResult} />
          
          <div className="bg-brand-900/20 p-6 rounded-2xl border border-brand-500/30 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="font-bold text-brand-300 text-lg mb-1">Step 3: Test Cross-Pollination</h3>
              <p className="text-sm text-brand-200/70">Dr. Ananya asks about Mrs. Padma's Ekadashi fast. Watch the pipeline automatically fetch Dr. Meera's new infection control constraint.</p>
            </div>
            <button className="btn-primary shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)]" onClick={run}>
              Run Dr. Ananya's Session
            </button>
          </div>
        </div>
      )}

      {status && (
        <div className="fixed bottom-6 right-6 bg-surface-800 border border-brand-500/30 text-brand-300 p-4 rounded-xl shadow-2xl animate-slide-up flex items-center gap-3 z-50">
          <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">{status}</p>
        </div>
      )}
    </div>
  );
}
