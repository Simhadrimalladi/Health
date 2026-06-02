import { useState } from 'react';
import ChatPanel from '../components/ChatPanel.jsx';
import ContextPanel from '../components/ContextPanel.jsx';

export default function Session({ userId, patientId }) {
  const [result, setResult] = useState(null);
  
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_500px] h-full animate-fade-in">
      <ChatPanel userId={userId} patientId={patientId} onResult={setResult} />
      <ContextPanel data={result} />
    </div>
  );
}
