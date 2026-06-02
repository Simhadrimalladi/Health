import Badge from './Badge.jsx';
import AnswerForm from './AnswerForm.jsx';
import { LEVEL_LABELS } from '../lib/constants.js';

const order = ['HOSPITAL', 'DEPARTMENT', 'ROLE', 'COHORT'];

export default function QuestionDisplay({ data, userId, user, onRefresh }) {
  if (!data) return (
    <div className="card-glass p-10 flex flex-col items-center text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <p className="text-lg font-medium text-slate-300">Select a user on the Dashboard to view their questions.</p>
    </div>
  );
  
  const { grouped, progress } = data;
  
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="card-glass p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="section-header text-2xl font-black text-white mb-2">
              <div className="section-dot bg-brand-400"></div>
              Targeted Knowledge Elicitation
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Questions are algorithmically filtered for <strong className="text-white">{data.user?.name || user?.name || userId}</strong> based on org, department, role, and patient cohort. P0 questions are mandatory before the first AI session can be launched.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0">
            <Badge tone={progress.canLaunchFirstSession ? 'green' : 'red'}>
              {progress.canLaunchFirstSession ? '✓ Session Unlocked' : '⚠ P0 Blocked'}
            </Badge>
            <Badge tone="blue">{progress.answeredCount} / {progress.totalApplicable} answered</Badge>
            <Badge tone="brand">P0 {progress.mandatoryP0Answered} / {progress.mandatoryP0Total}</Badge>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6">
        {order.map(level => {
          const questions = grouped[level] || [];
          if (questions.length === 0) return null;
          
          return (
            <section key={level} className="card p-0 overflow-hidden border-t border-t-white/10">
              <div className="bg-surface-800/80 p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-sm font-bold text-slate-200 tracking-wide uppercase">
                  <div className={`w-2 h-2 rounded-full ${level === 'HOSPITAL' ? 'bg-red-400' : level === 'DEPARTMENT' ? 'bg-amber-400' : level === 'ROLE' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                  {LEVEL_LABELS[level]}
                </h3>
                <Badge tone="slate">{questions.length} questions</Badge>
              </div>
              
              <div className="p-4 md:p-6 space-y-4 bg-surface-900/40">
                {questions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-white/10">
                    <div className="mb-4 flex flex-wrap gap-2 items-center">
                      <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-md ${
                        q.priority === 0 ? 'bg-red-500/20 text-red-300' : 
                        q.priority === 3 ? 'bg-slate-500/20 text-slate-300' : 
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        P{q.priority}{q.priority === 0 ? ' MANDATORY' : q.priority === 3 ? ' OPTIONAL' : ''}
                      </span>
                      <Badge tone="blue">{q.typeHint}</Badge>
                      <Badge>{q.targetHierarchyLevel}</Badge>
                      {q.answered && <Badge tone="green">Answered</Badge>}
                    </div>
                    
                    <p className="text-lg font-semibold text-white mb-2">
                      <span className="text-brand-400 mr-2">Q{idx + 1}.</span> 
                      {q.questionText}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1 mb-5 opacity-70">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-slate-400 font-medium">
                        Creates {q.typeHint} node at {q.targetHierarchyLevel} • Default Importance: {q.importanceDefault}
                      </p>
                    </div>
                    
                    {!q.answered ? (
                      <div className="mt-4 border-t border-white/10 pt-4">
                        <AnswerForm userId={userId} question={q} onAnswered={onRefresh} />
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex gap-3 items-start">
                        <svg className="w-5 h-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-emerald-300 mb-1">Answer successfully processed</p>
                          <p className="text-xs text-emerald-400/80">Tracked in question_answers for audit. Converted node stored in knowledge_nodes.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
