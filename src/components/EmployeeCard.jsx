export const DEPT_COLORS = {
  Engineering: "#4f46e5",
  Design: "#db2777",
  Marketing: "#ea580c",
  HR: "#0d9488",
  Finance: "#ca8a04",
  Sales: "#2563eb",
  Operations: "#7c3aed",
};
export const colorFor = (d) => DEPT_COLORS[d] || "#475569";

const initials = (n) =>
  n.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function EmployeeCard({ emp, view, onEdit, onDelete }) {
  const c = colorFor(emp.department);
  return (
    <article className={`badge ${view}`} style={{ "--c": c }}>
      <div className="badge-top">
        <span className="hole" />
        <span className="dept">{emp.department}</span>
      </div>
      <div className="avatar">{initials(emp.name)}</div>
      <div className="badge-body">
        <h3>{emp.name}</h3>
        <p className="meta">
          ID {emp.id} · {emp.gender}
        </p>
        <dl>
          <dt>Phone</dt>
          <dd>{emp.phone}</dd>
          <dt>Local</dt>
          <dd>{emp.localAddress}</dd>
          <dt>Permanent</dt>
          <dd>{emp.permanentAddress}</dd>
        </dl>
      </div>
      <div className="badge-actions">
        <button className="btn ghost" onClick={() => onEdit(emp)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(emp)}>Delete</button>
      </div>
    </article>
  );
}
