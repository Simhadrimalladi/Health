import { useState } from 'react';
import { api } from '../lib/api.js';
import NodePreview from './NodePreview.jsx';

export default function AnswerForm({ userId, question, onAnswered }) {
  const [answerText, setAnswerText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setLoading(true); setError('');
    try {
      const data = await api.answer({ userId, questionId: question.id, answerText });
      setResult(data);
      setAnswerText('');
      onAnswered?.(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea 
          className="input min-h-[100px] resize-y py-3 font-medium shadow-inner" 
          placeholder={question.placeholderText || 'Type the institutional answer...'} 
          value={answerText} 
          onChange={e => setAnswerText(e.target.value)} 
        />
        <div className="absolute top-3 right-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Draft
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-4">
        <button 
          className="btn-primary flex-1 sm:flex-none sm:w-64" 
          onClick={submit} 
          disabled={loading || !answerText.trim()}
        >
          {loading ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
          ) : (
            'Submit Answer → Create Node'
          )}
        </button>
        {error && <div className="text-sm font-medium text-red-400">{error}</div>}
      </div>
      
      <div className="animate-fade-in mt-4">
        <NodePreview result={result} />
      </div>
    </div>
  );
}
