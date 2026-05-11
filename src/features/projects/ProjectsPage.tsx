import { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { projectService } from './projectService';

const statusColor = (s: string) => {
  if (s === 'ACTIVE') return { bg: 'rgba(66,190,101,0.15)', color: '#42be65', border: 'rgba(66,190,101,0.3)' };
  if (s === 'COMPLETED') return { bg: 'rgba(15,98,254,0.15)', color: '#78a9ff', border: 'rgba(15,98,254,0.3)' };
  return { bg: 'rgba(141,141,141,0.15)', color: '#a8a8a8', border: 'rgba(141,141,141,0.3)' };
};

const Modal = ({ title, onClose, children }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
    <div style={{ background: '#262626', border: '1px solid #393939', width: '520px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #393939', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f4f4f4', fontSize: '16px', fontWeight: 600 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8d8d8d', fontSize: '20px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewProject, setViewProject] = useState<any>(null);
  const [projectEmployees, setProjectEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' });
  const { isAdmin } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await projectService.getAll(); setProjects(Array.isArray(r.data) ? r.data : r.data.content || []); }
    catch { setError('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const openView = async (p: any) => {
    setViewProject(p);
    try { const r = await projectService.getEmployees(p.id); setProjectEmployees(Array.isArray(r.data) ? r.data : []); }
    catch { setProjectEmployees([]); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', startDate: '', endDate: '', status: 'ACTIVE' }); setShowModal(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', startDate: p.startDate?.split('T')[0] || '', endDate: p.endDate?.split('T')[0] || '', status: p.status });
    setShowModal(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      if (editing) await projectService.update(editing.id, form);
      else await projectService.create(form);
      setShowModal(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try { await projectService.delete(id); load(); }
    catch { setError('Delete failed'); }
  };

  const fmtDate = (d: string) => d?.split('T')[0] || '—';

  return (
    <div style={{ padding: '32px', background: '#f4f4f4', minHeight: 'calc(100vh - 48px)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#161616', marginBottom: '4px' }}>Projects</h1>
          <p style={{ fontSize: '14px', color: '#525252' }}>Manage projects and employee assignments</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{ padding: '10px 20px', background: '#0f62fe', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            + New Project
          </button>
        )}
      </div>

      {error && <div style={{ padding: '12px 16px', background: '#fff1f1', border: '1px solid #da1e28', color: '#da1e28', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#525252', background: '#fff', border: '1px solid #e0e0e0' }}>Loading...</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#e0e0e0', borderBottom: '1px solid #c6c6c6' }}>
                {['Name', 'Description', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#525252', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => {
                const sc = statusColor(p.status);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e8e8e8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#161616' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#525252', maxWidth: '240px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description || '—'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#525252', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtDate(p.startDate)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#525252', fontFamily: 'IBM Plex Mono, monospace' }}>{fmtDate(p.endDate)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontWeight: 500 }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openView(p)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #4d82fc', color: '#78a9ff', fontSize: '12px', cursor: 'pointer' }}>Members</button>
                        {isAdmin && <button onClick={() => openEdit(p)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #4d82fc', color: '#78a9ff', fontSize: '12px', cursor: 'pointer' }}>Edit</button>}
                        {isAdmin && <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #da1e28', color: '#ff8389', fontSize: '12px', cursor: 'pointer' }}>Delete</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#8d8d8d' }}>No projects found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View members modal */}
      {viewProject && (
        <Modal title={`${viewProject.name} — Team Members`} onClose={() => setViewProject(null)}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: '#a8a8a8' }}>{viewProject.description}</p>
          </div>
          {projectEmployees.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#8d8d8d', fontSize: '13px', border: '1px solid #393939' }}>No employees assigned</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projectEmployees.map((e: any) => (
                <div key={e.id || e.employeeId} style={{ padding: '12px 16px', background: '#393939', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#f4f4f4', fontWeight: 500 }}>{e.fullName || e.employeeName || e.firstName}</div>
                    <div style={{ fontSize: '12px', color: '#8d8d8d' }}>{e.email}</div>
                  </div>
                  {isAdmin && (
                    <button onClick={async () => {
                      await projectService.removeEmployee(viewProject.id, e.id || e.employeeId);
                      const r = await projectService.getEmployees(viewProject.id);
                      setProjectEmployees(Array.isArray(r.data) ? r.data : []);
                    }} style={{ background: 'transparent', border: '1px solid #da1e28', color: '#ff8389', fontSize: '11px', padding: '4px 8px', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Project' : 'New Project'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            {[
              { label: 'Project Name', key: 'name', type: 'text', required: true },
              { label: 'Description', key: 'description', type: 'text' },
              { label: 'Start Date', key: 'startDate', type: 'date' },
              { label: 'End Date', key: 'endDate', type: 'date' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px' }}>{f.label}{f.required ? ' *' : ''}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required}
                  style={{ width: '100%', padding: '10px 12px', background: '#393939', border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none' }} />
              </div>
            ))}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px' }}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', background: '#393939', border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none' }}>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #525252', color: '#c6c6c6', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#0f62fe', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProjectsPage;
