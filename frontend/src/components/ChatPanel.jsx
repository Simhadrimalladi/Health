import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { DEFAULT_QUERY } from '../lib/constants.js';

export default function ChatPanel({ userId, patientId, onResult }) {
  const [message, setMessage] = useState(DEFAULT_QUERY);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onboarding, setOnboarding] = useState(null);

  useEffect(() => {
    if (!userId) return;
    api.relevantQuestions(userId)
      .then(data => setOnboarding({ user: data.user, progress: data.progress }))
      .catch(() => setOnboarding(null));
  }, [userId]);

  const isFirstSessionLocked = onboarding && !onboarding.user?.hasCompletedOnboarding && !onboarding.progress?.canLaunchFirstSession;

  async function run() {
    if (!message.trim() || isFirstSessionLocked) return;
    setLoading(true); 
    setError('');
    try {
      const data = await api.session({ userId, patientId, message });
      setResponse(data.response); 
      onResult?.(data);
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="card-glass flex flex-col h-[calc(100vh-120px)] animate-slide-up">
      <div className="p-6 border-b border-white/10 shrink-0">
        <h2 className="section-header text-xl font-bold text-white mb-2">
          <div className="section-dot bg-brand-500"></div>
          AI Session
        </h2>
        <p className="text-sm text-slate-400">
          The AI responds from the filtered knowledge nodes injected by the Rules Engine. P0 onboarding is enforced before a first session.
        </p>
      </div>
      
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {isFirstSessionLocked && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
            <strong className="text-red-300">First session locked.</strong> Complete mandatory P0 questions first: {onboarding.progress.mandatoryP0Answered}/{onboarding.progress.mandatoryP0Total} answered. Go to Onboarding, submit the P0 answers, then return here.
          </div>
        )}

        {response ? (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="self-end max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 p-4 shadow-md">
              <div className="text-[10px] uppercase tracking-widest text-brand-200 mb-1 font-bold">You</div>
              <p className="text-white text-sm leading-relaxed">{message}</p>
            </div>
            
            <div className="self-start max-w-[90%] rounded-2xl rounded-tl-sm bg-surface-800 border border-white/10 p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient"></div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-brand-500/20 text-brand-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A12.014 12.014 0 0010.326 1c-6.273 0-11.36 5.05-11.36 11.28v.57c0 3.255 2.66 5.894 5.94 5.894h4.434c4.603 0 8.333-3.69 8.333-8.238 0-5.694-4.708-10.31-10.518-10.46a.75.75 0 01-.655-.656A12.012 12.012 0 0011.3 1.046z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-brand-400 font-bold">Brahmo AI</div>
              </div>
              <p className="text-slate-200 text-sm leading-7 whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Session ready. Ask a question to begin.</p>
          </div>
        )}
        
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 shrink-0 bg-surface-900/50">
        <div className="relative">
          <textarea 
            className="input pr-12 min-h-[60px] max-h-[150px] resize-y py-3 shadow-inner" 
            placeholder="Ask a medical question requiring organizational context..." 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                run();
              }
            }}
          />
          <button 
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-50 transition-colors"
            onClick={run} 
            disabled={loading || !message.trim() || isFirstSessionLocked}
            title="Send (Enter)"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
