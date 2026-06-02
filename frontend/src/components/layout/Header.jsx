export default function Header({ user, patient }) {
  return (
    <header className="border-b border-white/10 bg-surface-950/50 px-6 py-4 backdrop-blur-md sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="md:hidden">
          <h1 className="text-xl font-black tracking-tight text-white">BRAHMO</h1>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-slate-300">
            Knowledge Questions <span className="text-brand-500">→</span> Typed Nodes <span className="text-brand-500">→</span> Filtered Context <span className="text-brand-500">→</span> AI Session
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col text-right">
            <span className="font-bold text-white">{user?.name || 'Select user'}</span>
            <span className="text-xs text-slate-400">{user?.role ? `${user.role} • ${user.department}` : 'No role'}</span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col text-right">
            <span className="font-bold text-white">{patient?.name || 'No patient'}</span>
            <span className="text-xs text-slate-400">Context Target</span>
          </div>
        </div>
      </div>
    </header>
  );
}
