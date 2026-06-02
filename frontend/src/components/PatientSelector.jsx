export default function PatientSelector({ patients = [], value, onChange }) {
  return (
    <label className="block w-full">
      <span className="label">Select Patient Context</span>
      <select className="select mt-1" value={value || ''} onChange={e => onChange(e.target.value || null)}>
        <option value="" className="bg-surface-800 text-slate-200">No patient (Global Context Only)</option>
        {patients.map(p => (
          <option key={p.id} value={p.id} className="bg-surface-800 text-slate-200">
            {p.name} — {p.conditions?.join(', ')}
          </option>
        ))}
      </select>
    </label>
  );
}
