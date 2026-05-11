import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm = ({ onSubmit, isLoading = false, error }: LoginFormProps) => {
  const [username, setUsername] = useState('hr.admin');
  const [password, setPassword] = useState('Admin@IBM123');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#161616',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'IBM Plex Sans, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Blue accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#0f62fe' }} />

      <div style={{
        width: '400px',
        background: '#262626',
        border: '1px solid #393939',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid #393939' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: '#0f62fe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm-1 4v7l6 3-1 1.732-7-3.5V10h2z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#8d8d8d', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>IBM</div>
              <div style={{ fontSize: '14px', color: '#f4f4f4', fontWeight: 600 }}>Employee Management System</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#6f6f6f' }}>State Bank of India · Enterprise Portal</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px' }}>
          <h2 style={{ fontSize: '20px', color: '#f4f4f4', fontWeight: 400, marginBottom: '24px' }}>Sign in</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '8px', fontWeight: 500 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%', padding: '11px 16px',
                background: '#393939', border: '1px solid #525252',
                color: '#f4f4f4', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#0f62fe'}
              onBlur={e => e.target.style.borderColor = '#525252'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#c6c6c6', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              style={{
                width: '100%', padding: '11px 16px',
                background: '#393939', border: '1px solid #525252',
                color: '#f4f4f4', fontSize: '14px', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#0f62fe'}
              onBlur={e => e.target.style.borderColor = '#525252'}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', background: '#2d0f10', border: '1px solid #da1e28',
              color: '#ff8389', fontSize: '13px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', padding: '13px 16px',
              background: isLoading ? '#393939' : '#0f62fe',
              border: 'none', color: '#ffffff',
              fontSize: '14px', fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (!isLoading) (e.target as any).style.background = '#0353e9'; }}
            onMouseLeave={e => { if (!isLoading) (e.target as any).style.background = '#0f62fe'; }}
          >
            {isLoading ? 'Authenticating...' : 'Sign in'}
          </button>

          <div style={{ marginTop: '24px', padding: '16px', background: '#1c1c1c', border: '1px solid #393939' }}>
            <div style={{ fontSize: '11px', color: '#6f6f6f', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Demo Credentials
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '12px', color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>
                <span style={{ color: '#0f62fe' }}>ADMIN</span> · hr.admin / Admin@IBM123
              </div>
              <div style={{ fontSize: '12px', color: '#8d8d8d', fontFamily: 'IBM Plex Mono, monospace' }}>
                <span style={{ color: '#42be65' }}>USER</span> · emp.user / User@IBM123
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
