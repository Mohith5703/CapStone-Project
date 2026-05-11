import { useEffect, useState } from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { departmentService } from './departmentService';

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

const DepartmentsPage = () => {
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const { isAdmin } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await departmentService.getAll(); setDepts(r.data); }
    catch { setError('Failed to load departments'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (d: any) => { setEditing(d); setForm({ name: d.name, description: d.description || '' }); setShowModal(true); };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      if (editing) await departmentService.update(editing.id, form);
      else await departmentService.create(form);
      setShowModal(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this department?')) return;
    try { await departmentService.delete(id); load(); }
    catch { setError('Delete failed'); }
  };

  return (
    <div style={{ padding: '32px', background: '#f4f4f4', minHeight: 'calc(100vh - 48px)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#161616', marginBottom: '4px' }}>Departments</h1>
          <p style={{ fontSize: '14px', color: '#525252' }}>Manage organizational departments</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} style={{ padding: '10px 20px', background: '#0f62fe', border: 'none', color: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif' }}>
            + Add Department
          </button>
        )}
      </div>

      {error && <div style={{ padding: '12px 16px', background: '#fff1f1', border: '1px solid #da1e28', color: '#da1e28', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#525252', background: '#fff', border: '1px solid #e0e0e0' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1px', background: '#e0e0e0' }}>
          {depts.map((d, i) => (
            <div key={d.id} style={{ background: '#fff', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: ['#0f62fe','#009d9a','#8a3ffc','#198038','#eb6200','#1192e8'][i % 6],
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                }}>
                  {d.name?.charAt(0)}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(d)} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #8d8d8d', color: '#525252', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(d.id)} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #da1e28', color: '#da1e28', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#161616', marginBottom: '6px' }}>{d.name}</h3>
              <p style={{ fontSize: '13px', color: '#525252', lineHeight: 1.5 }}>{d.description || 'No description'}</p>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>ID: {d.id?.slice(-8)}</div>
            </div>
          ))}
          {depts.length === 0 && (
            <div style={{ background: '#fff', padding: '48px', textAlign: 'center', color: '#8d8d8d', gridColumn: '1/-1' }}>No departments found</div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Department' : 'Add Department'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px' }}>Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                style={{ width: '100%', padding: '10px 12px', background: '#393939', border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '6px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                style={{ width: '100%', padding: '10px 12px', background: '#393939', border: '1px solid #525252', color: '#f4f4f4', fontSize: '13px', outline: 'none', resize: 'vertical' }} />
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

export default DepartmentsPage;
