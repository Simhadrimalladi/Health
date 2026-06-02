import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api.js';
import { DEFAULT_PATIENT, DEFAULT_USER } from './lib/constants.js';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Session from './pages/Session.jsx';
import Comparison from './pages/Comparison.jsx';
import Health from './pages/Health.jsx';
import Admin from './pages/Admin.jsx';
import Graph from './pages/Graph.jsx';

export default function App() {
  const [active, setActive] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [userId, setUserId] = useState(DEFAULT_USER);
  const [patientId, setPatientId] = useState(DEFAULT_PATIENT);
  const [error, setError] = useState('');

  useEffect(() => { Promise.all([api.users(), api.patients()]).then(([u,p]) => { setUsers(u); setPatients(p); }).catch(e => setError(e.message)); }, []);
  const user = useMemo(() => users.find(u => u.id === userId), [users, userId]);
  const patient = useMemo(() => patients.find(p => p.id === patientId), [patients, patientId]);

  let page = null;
  if (active === 'Dashboard') page = <Dashboard users={users} patients={patients} userId={userId} setUserId={setUserId} patientId={patientId} setPatientId={setPatientId} onTab={setActive}/>;
  if (active === 'Onboarding') page = <Onboarding userId={userId} user={user}/>;
  if (active === 'Session') page = <Session userId={userId} patientId={patientId}/>;
  if (active === 'Comparison') page = <Comparison userId={userId} patientId={patientId}/>;
  if (active === 'Health') page = <Health userId={userId}/>;
  if (active === 'Admin') page = <Admin/>;
  if (active === 'Graph') page = <Graph/>;

  return <AppShell active={active} onTab={setActive} user={user} patient={patient}>{error ? <div className="card p-5 text-red-700">API error: {error}. Start backend and seed MongoDB.</div> : page}</AppShell>;
}
