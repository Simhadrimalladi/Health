import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import QuestionDisplay from '../components/QuestionDisplay.jsx';

export default function Onboarding({ userId, user }) {
  const [data, setData] = useState(null); 
  const [error, setError] = useState('');
  
  const load = () => api.relevantQuestions(userId).then(setData).catch(e => setError(e.message));
  
  useEffect(() => { load(); }, [userId]);
  
  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto">
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      <QuestionDisplay data={data} userId={userId} user={user} onRefresh={load} />
    </div>
  );
}
