import { useState } from "react";
import { DEPT_COLORS } from "./EmployeeCard";

const blank = {
  name: "", id: "", department: "Engineering", gender: "Female",
  phone: "", localAddress: "", permanentAddress: "",
};

export default function EmployeeForm({ initial, existingIds, onSave, onClose }) {
  const editing = Boolean(initial);
  const [form, setForm] = useState(initial || blank);
  const [same, setSame] = useState(false);
  const [errors, setErrors] = useState({});

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (same && name === "localAddress") next.permanentAddress = value;
      return next;
    });
  };

  const toggleSame = (e) => {
    setSame(e.target.checked);
    if (e.target.checked) setForm((f) => ({ ...f, permanentAddress: f.localAddress }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter the employee's full name.";
    if (!form.id.trim()) e.id = "Employee ID is required.";
    else if (!editing && existingIds.includes(form.id.trim()))
      e.id = "This ID already exists. Use a different one.";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone number must be exactly 10 digits.";
    if (!form.localAddress.trim()) e.localAddress = "Local address is required.";
    if (!form.permanentAddress.trim()) e.permanentAddress = "Permanent address is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) onSave({ ...form, name: form.name.trim(), id: form.id.trim() });
  };

  const Field = ({ label, name, children }) => (
    <label className={`field ${errors[name] ? "bad" : ""}`}>
      <span>{label}</span>
      {children}
      {errors[name] && <small>{errors[name]}</small>}
    </label>
  );

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h2>{editing ? `Edit ${initial.name}` : "Add a new employee"}</h2>
        <div className="grid2">
          <Field label="Full name" name="name">
            <input name="name" value={form.name} onChange={change} placeholder="Ananya Sen" autoFocus />
          </Field>
          <Field label="Employee ID" name="id">
            <input name="id" value={form.id} onChange={change} disabled={editing} placeholder="EMP-101" />
          </Field>
          <Field label="Department" name="department">
            <select name="department" value={form.department} onChange={change}>
              {Object.keys(DEPT_COLORS).map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Gender" name="gender">
            <select name="gender" value={form.gender} onChange={change}>
              <option>Female</option><option>Male</option><option>Other</option>
            </select>
          </Field>
          <Field label="Phone number" name="phone">
            <input name="phone" value={form.phone} inputMode="numeric" maxLength={10}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              placeholder="9876543210" />
          </Field>
        </div>
        <Field label="Local address" name="localAddress">
          <textarea name="localAddress" rows={2} value={form.localAddress} onChange={change} />
        </Field>
        <label className="check">
          <input type="checkbox" checked={same} onChange={toggleSame} /> Permanent address is the same as local
        </label>
        <Field label="Permanent address" name="permanentAddress">
          <textarea name="permanentAddress" rows={2} value={form.permanentAddress}
            onChange={change} disabled={same} />
        </Field>
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">{editing ? "Save changes" : "Add employee"}</button>
        </div>
      </form>
    </div>
  );
}
