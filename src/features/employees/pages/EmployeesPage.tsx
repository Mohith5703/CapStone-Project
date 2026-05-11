import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { employeeService } from '../employeeService';
import { type Employee } from '../employee.types';

const statusColor = (s: string) => {
  if (s === 'ACTIVE') return { bg: 'rgba(66,190,101,0.15)', color: '#42be65', border: 'rgba(66,190,101,0.3)' };
  if (s === 'TERMINATED') return { bg: 'rgba(218,30,40,0.15)', color: '#ff8389', border: 'rgba(218,30,40,0.3)' };
  return { bg: 'rgba(141,141,141,0.15)', color: '#a8a8a8', border: 'rgba(141,141,141,0.3)' };
};

const Btn = ({ onClick, children, variant = 'ghost', disabled = false }: any) => {
  const styles: any = {
    primary: { bg: '#0f62fe', color: '#fff', border: '#0f62fe' },
    danger: { bg: 'transparent', color: '#ff8389', border: '#da1e28' },
    ghost: { bg: 'transparent', color: '#78a9ff', border: '#4d82fc' },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 14px', fontSize: '12px', cursor: disabled ? 'not-allowed' : 'pointer',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: 'IBM Plex Sans, sans-serif', transition: 'opacity 0.15s',
      opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  );
};

const Modal = ({ title, onClose, children }: any) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }} onClick={onClose}>
    <div style={{
      background: '#262626', border: '1px solid #393939',
      width: '520px', maxHeight: '80vh', overflow: 'auto',
    }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #393939', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f4f4f4', fontSize: '16px', fontWeight: 600 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8d8d8d', fontSize: '20px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const FormField = ({ label, value, onChange, type = 'text', required = false, options }: any) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px', fontWeight: 500 }}>{label}{required && ' *'}</label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} required={required} style={{
        width: '100%', padding: '10px 12px', background: '#393939',
        border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none',
      }}>
        <option value="">Select...</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} style={{
        width: '100%', padding: '10px 12px', background: '#393939',
        border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none',
      }} />
    )}
  </div>
);

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [viewEmp, setViewEmp] = useState<Employee | null>(null);
  const [depts, setDepts] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    firstName: '', lastName: '', email: '', phone: '', salary: '',
    hireDate: '', status: 'ACTIVE', departmentId: '', roleId: ''
  });
  const { isAdmin } = useAuth();

  useEffect(() => { loadEmployees(); }, [page]);
  useEffect(() => {
    import('../../../features/departments/departmentService').then(m =>
      m.departmentService.getAll().then(r => setDepts(r.data.map((d: any) => ({ value: d.id, label: d.name }))))
    );
    import('../../../features/roles/roleService').then(m =>
      m.roleService.getAll().then(r => setRoles(r.data.map((ro: any) => ({ value: ro.id, label: ro.name }))))
    );
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const r = await employeeService.getAll(page, 10);
      setEmployees(r.data.content);
      setTotalPages(r.data.totalPages);
    } catch { setError('Failed to load employees'); }
    finally { setLoading(false); }
  };

  const handleSearch = async (v: string) => {
    setSearchTerm(v);
    if (v.length > 1) {
      const r = await employeeService.search(v);
      setEmployees(Array.isArray(r.data) ? r.data : r.data.content || []);
    } else if (v.length === 0) loadEmployees();
  };

  const openCreate = () => {
    setEditingEmp(null);
    setForm({ firstName: '', lastName: '', email: '', phone: '', salary: '', hireDate: '', status: 'ACTIVE', departmentId: '', roleId: '' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setForm({
      firstName: emp.firstName, lastName: emp.lastName, email: emp.email,
      phone: emp.phone || '', salary: emp.salary || '',
      hireDate: emp.hireDate?.split('T')[0] || '',
      status: emp.status, departmentId: emp.departmentId, roleId: emp.roleId,
    });
    setShowModal(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      if (editingEmp) await employeeService.update(editingEmp.id, form);
      else await employeeService.create(form);
      setShowModal(false);
      loadEmployees();
    } catch (err: any) { setError(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Terminate this employee?')) return;
    try { await employeeService.delete(id); loadEmployees(); }
    catch { setError('Delete failed'); }
  };

  const f = (k: string) => (v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <div style={{ padding: '32px', background: '#f4f4f4', minHeight: 'calc(100vh - 48px)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#161616', marginBottom: '4px' }}>Employees</h1>
          <p style={{ fontSize: '14px', color: '#525252' }}>Manage employee records and information</p>
        </div>
        {isAdmin && <Btn variant="primary" onClick={openCreate}>+ Add Employee</Btn>}
      </div>

      {/* Search + stats */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', marginBottom: '1px' }}>
        <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search employees by name..."
            style={{
              flex: 1, padding: '10px 16px', background: '#f4f4f4',
              border: '1px solid #e0e0e0', fontSize: '14px', outline: 'none',
              color: '#161616',
            }}
          />
          <span style={{ fontSize: '13px', color: '#525252', whiteSpace: 'nowrap' }}>
            {employees.length} records
          </span>
        </div>
      </div>

      {error && <div style={{ padding: '12px 24px', background: '#fff1f1', border: '1px solid #da1e28', color: '#da1e28', marginBottom: '1px', fontSize: '13px' }}>{error}</div>}

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#525252' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e0e0e0', borderBottom: '1px solid #c6c6c6' }}>
                {['ID', 'Name', 'Email', 'Department', 'Role', 'Hire Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#525252', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => {
                const sc = statusColor(emp.status);
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #e8e8e8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>{emp.id?.slice(-6)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#161616', fontWeight: 500 }}>{emp.fullName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#525252' }}>{emp.email}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#161616' }}>{emp.departmentName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#161616' }}>{emp.roleName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#525252', fontFamily: 'IBM Plex Mono, monospace' }}>{emp.hireDate?.split('T')[0]}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontWeight: 500 }}>{emp.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Btn onClick={() => setViewEmp(emp)}>View</Btn>
                        {isAdmin && <Btn onClick={() => openEdit(emp)}>Edit</Btn>}
                        {isAdmin && <Btn variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Btn>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#8d8d8d', fontSize: '14px' }}>No employees found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', justifyContent: 'flex-end' }}>
          <Btn onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Prev</Btn>
          <span style={{ fontSize: '13px', color: '#525252', padding: '0 8px' }}>Page {page + 1} of {totalPages}</span>
          <Btn onClick={() => setPage(p => p + 1)} disabled={page === totalPages - 1}>Next →</Btn>
        </div>
      )}

      {/* View modal */}
      {viewEmp && (
        <Modal title="Employee Details" onClose={() => setViewEmp(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              ['First Name', viewEmp.firstName], ['Last Name', viewEmp.lastName],
              ['Email', viewEmp.email], ['Phone', viewEmp.phone || '—'],
              ['Department', viewEmp.departmentName], ['Role', viewEmp.roleName],
              ['Status', viewEmp.status], ['Hire Date', viewEmp.hireDate?.split('T')[0]],
              ['Salary', viewEmp.salary ? `₹${viewEmp.salary.toLocaleString()}` : '—'],
            ].map(([label, val]) => (
              <div key={label as string}>
                <div style={{ fontSize: '11px', color: '#8d8d8d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '14px', color: '#f4f4f4' }}>{val as string}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <Modal title={editingEmp ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <FormField label="First Name" value={form.firstName} onChange={f('firstName')} required />
              <FormField label="Last Name" value={form.lastName} onChange={f('lastName')} required />
              <FormField label="Email" value={form.email} onChange={f('email')} type="email" required />
              <FormField label="Phone" value={form.phone} onChange={f('phone')} />
              <FormField label="Salary" value={form.salary} onChange={f('salary')} type="number" />
              <FormField label="Hire Date" value={form.hireDate} onChange={f('hireDate')} type="date" />
              <FormField label="Status" value={form.status} onChange={f('status')} options={[{value:'ACTIVE',label:'Active'},{value:'INACTIVE',label:'Inactive'},{value:'TERMINATED',label:'Terminated'}]} />
              <FormField label="Department" value={form.departmentId} onChange={f('departmentId')} options={depts} />
              <FormField label="Role" value={form.roleId} onChange={f('roleId')} options={roles} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Btn onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => {}}>
                <button type="submit" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '12px', padding: 0 }}>
                  {editingEmp ? 'Update' : 'Create'}
                </button>
              </Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EmployeesPage;
