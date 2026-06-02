const items = ['Dashboard', 'Onboarding', 'Session', 'Comparison', 'Health', 'Admin', 'Graph'];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="w-full flex-shrink-0 border-r border-white/10 bg-surface-950 p-4 md:w-64 md:p-5">
      <div className="mb-8 hidden md:block">
        <h1 className="text-2xl font-black tracking-tight text-white">BRAHMO</h1>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-400">Knowledge Elicitation</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {items.map(i => (
          <button
            key={i}
            className={active === i ? 'nav-item-active' : 'nav-item'}
            onClick={() => onChange(i)}
          >
            {i}
          </button>
        ))}
      </nav>
    </aside>
  );
}
