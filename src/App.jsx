import { useEffect, useMemo, useState } from "react";
import EmployeeCard, { DEPT_COLORS, colorFor } from "./components/EmployeeCard";
import EmployeeForm from "./components/EmployeeForm";

const SEED = [
  { id: "EMP-101", name: "Ananya Sen", department: "Engineering", gender: "Female", phone: "9830012345", localAddress: "12 Park Street, Kolkata", permanentAddress: "45 Lake Road, Siliguri" },
  { id: "EMP-102", name: "Rohan Mehta", department: "Design", gender: "Male", phone: "9876543210", localAddress: "7 Salt Lake Sector V, Kolkata", permanentAddress: "22 MG Road, Pune" },
  { id: "EMP-103", name: "Priya Nair", department: "HR", gender: "Female", phone: "9845098450", localAddress: "3 Howrah Bridge Rd, Kolkata", permanentAddress: "9 Beach Road, Kochi" },
];

export default function App() {
  const [employees, setEmployees] = useState(() => {
    try { return JSON.parse(localStorage.getItem("employees")) || SEED; }
    catch { return SEED; }
  });
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [view, setView] = useState("grid");
  const [dark, setDark] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => localStorage.setItem("employees", JSON.stringify(employees)), [employees]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const c = {};
    employees.forEach((e) => (c[e.department] = (c[e.department] || 0) + 1));
    return c;
  }, [employees]);

  const visible = employees.filter((e) => {
    const q = search.toLowerCase().trim();
    const hit = !q || [e.name, e.id, e.phone, e.department].some((v) => v.toLowerCase().includes(q));
    return hit && (dept === "All" || e.department === dept);
  });

  const save = (emp) => {
    if (editTarget) {
      setEmployees((list) => list.map((e) => (e.id === emp.id ? emp : e)));
      setToast(`Saved changes to ${emp.name}`);
    } else {
      setEmployees((list) => [emp, ...list]);
      setToast(`Added ${emp.name}`);
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const confirmDelete = () => {
    setEmployees((list) => list.filter((e) => e.id !== deleteTarget.id));
    setToast(`Deleted ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const openEdit = (emp) => { setEditTarget(emp); setFormOpen(true); };
  const openAdd = () => { setEditTarget(null); setFormOpen(true); };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <h1>Staffroom</h1>
          <p>Everyone in the company, one badge each.</p>
        </div>
        <div className="hero-right">
          <div className="total"><b>{employees.length}</b><span>employees</span></div>
          <button className="btn ghost" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <button className="btn primary" onClick={openAdd}>+ Add employee</button>
        </div>
      </header>

      <section className="chips" aria-label="Filter by department">
        <button className={`chip ${dept === "All" ? "on" : ""}`} style={{ "--c": "#111827" }}
          onClick={() => setDept("All")}>All <em>{employees.length}</em></button>
        {Object.keys(DEPT_COLORS).map((d) => (
          <button key={d} className={`chip ${dept === d ? "on" : ""}`} style={{ "--c": colorFor(d) }}
            onClick={() => setDept(d)}>{d} <em>{counts[d] || 0}</em></button>
        ))}
      </section>

      <section className="toolbar">
        <input className="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID, phone or department" />
        <div className="seg">
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>Grid</button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>List</button>
        </div>
        <p className="result-count">
          Showing {visible.length} of {employees.length}
        </p>
      </section>

      {visible.length === 0 ? (
        <div className="empty">
          <h2>{employees.length === 0 ? "No employees yet" : "No matches found"}</h2>
          <p>
            {employees.length === 0
              ? "Add your first employee to start the directory."
              : "Try a different name or clear the department filter."}
          </p>
          {employees.length === 0 ? (
            <button className="btn primary" onClick={openAdd}>Add employee</button>
          ) : (
            <button className="btn ghost" onClick={() => { setSearch(""); setDept("All"); }}>Clear filters</button>
          )}
        </div>
      ) : (
        <main className={`cards ${view}`}>
          {visible.map((e) => (
            <EmployeeCard key={e.id} emp={e} view={view} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </main>
      )}

      {formOpen && (
        <EmployeeForm
          initial={editTarget}
          existingIds={employees.map((e) => e.id)}
          onSave={save}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <div className="overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h2>Delete {deleteTarget.name}?</h2>
            <p>This removes {deleteTarget.id} from the directory. You can't undo this.</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setDeleteTarget(null)}>Keep employee</button>
              <button className="btn danger solid" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
