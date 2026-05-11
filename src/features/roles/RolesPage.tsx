import { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { roleService } from './roleService';

const levelColors = ['#009d9a','#0f62fe','#8a3ffc','#198038','#eb6200','#1192e8','#da1e28','#f1c21b'];

const Modal = ({ title, onClose, children }: any) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
    <div style={{ background: '#262626', border: '1px solid #393939', width: '460px' }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #393939', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f4f4f4', fontSize: '16px', fontWeight: 600 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8d8d8d', fontSize: '20px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  </div>
);

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', level: '' });
  const { isAdmin } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await roleService.getAll(); setRoles(Array.isArray(r.data) ? r.data : []); }
    catch { setError('Failed to load roles'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '', level: '' }); setShowModal(true); };
  const openEdit = (r: any) => { setEditing(r); setForm({ name: r.name, description: r.description || '', level: r.level || '' }); setShowModal(true); };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const payload = { ...form, level: form.level ? parseInt(form.level) : undefined };
      if (editing) await roleService.update(editing.id, payload);
      else await roleService.create(payload);
      setShowModal(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this role?')) return;
    try { await roleService.delete(id); load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <div style={{ padding: '32px', background: '#f4f4f4', minHeight: 'calc(100vh - 48px)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#161616', marginBottom: '4px' }}>Roles</h1>
          <p style={{ fontSize: '14px', color: '#525252' }}>Manage employee roles and levels</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{ padding: '10px 20px', background: '#0f62fe', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            + Add Role
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
                {['Level', 'Role Name', 'Description', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#525252', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.sort((a, b) => (a.level || 0) - (b.level || 0)).map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e8e8e8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: levelColors[(r.level || i) % levelColors.length],
                      color: '#fff', fontSize: '13px', fontWeight: 700,
                    }}>
                      {r.level || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#161616' }}>{r.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#525252' }}>{r.description || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(r)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #4d82fc', color: '#78a9ff', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(r.id)} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #da1e28', color: '#ff8389', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#8d8d8d' }}>No roles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Role' : 'Add Role'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            {[
              { label: 'Role Name', key: 'name', type: 'text', required: true },
              { label: 'Description', key: 'description', type: 'text' },
              { label: 'Level', key: 'level', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px' }}>{f.label}{f.required ? ' *' : ''}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required={f.required}
                  style={{ width: '100%', padding: '10px 12px', background: '#393939', border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #525252', color: '#c6c6c6', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 20px', background: '#0f62fe', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RolesPage;
