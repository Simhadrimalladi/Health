export default function UserSelector({ users = [], value, onChange }) {
  return (
    <label className="block w-full">
      <span className="label">Simulate User</span>
      <select className="select mt-1" value={value} onChange={e => onChange(e.target.value)}>
        {users.map(u => (
          <option key={u.id} value={u.id} className="bg-surface-800 text-slate-200">
            {u.name} — {u.role} / {u.department}
          </option>
        ))}
      </select>
    </label>
  );
}
