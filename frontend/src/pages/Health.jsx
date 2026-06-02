import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import HealthScore from '../components/HealthScore.jsx';

export default function Health({ userId }) { 
  const [data, setData] = useState(null); 
  
  useEffect(() => {
    api.health(userId).then(setData).catch(console.error);
  }, [userId]); 
  
  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in">
      <HealthScore data={data} />
    </div>
  ); 
}
