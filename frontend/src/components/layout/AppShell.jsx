import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppShell({ active, onTab, user, patient, children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} onChange={onTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} patient={patient} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
