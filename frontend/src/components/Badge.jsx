export default function Badge({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-white/10 text-slate-300 border-white/10',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    brand: 'bg-brand-500/10 text-brand-300 border-brand-500/30'
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate} backdrop-blur-sm shadow-sm transition-all duration-200`}>
      {children}
    </span>
  );
}
