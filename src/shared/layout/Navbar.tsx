import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAuthenticated ? [
    { to: '/employees', label: 'Employees' },
    { to: '/departments', label: 'Departments' },
    { to: '/projects', label: 'Projects' },
    { to: '/roles', label: 'Roles' },
  ] : [];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav style={{
      height: '48px',
      background: '#161616',
      borderBottom: '1px solid #393939',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: 'IBM Plex Sans, sans-serif',
    }}>
      {/* Logo / Brand */}
      <Link to={isAuthenticated ? '/employees' : '/login'} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        textDecoration: 'none', marginRight: '24px', flexShrink: 0,
      }}>
        <div style={{
          width: '24px', height: '24px', background: '#0f62fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 32 32" fill="white">
            <path d="M4 20h24v2H4zm0 4h24v2H4zm0-8h24v2H4zm0-4h24v2H4zm0-4h24v2H4zm0-4h24v2H4z"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '10px', color: '#8d8d8d', letterSpacing: '0.08em', fontWeight: 500 }}>IBM</span>
          <span style={{ fontSize: '13px', color: '#f4f4f4', fontWeight: 600, letterSpacing: '0.01em' }}>EMS</span>
        </div>
      </Link>

      {/* Separator */}
      <div style={{ width: '1px', height: '24px', background: '#393939', marginRight: '16px' }} />

      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1, gap: '0' }}>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: 'flex', alignItems: 'center',
              padding: '0 16px',
              fontSize: '14px',
              color: isActive(item.to) ? '#ffffff' : '#c6c6c6',
              textDecoration: 'none',
              borderBottom: isActive(item.to) ? '2px solid #0f62fe' : '2px solid transparent',
              background: isActive(item.to) ? 'rgba(15,98,254,0.08)' : 'transparent',
              transition: 'all 0.1s',
              fontWeight: isActive(item.to) ? 500 : 400,
            }}
            onMouseEnter={e => {
              if (!isActive(item.to)) {
                (e.currentTarget as any).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as any).style.color = '#ffffff';
              }
            }}
            onMouseLeave={e => {
              if (!isActive(item.to)) {
                (e.currentTarget as any).style.background = 'transparent';
                (e.currentTarget as any).style.color = '#c6c6c6';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              fontSize: '11px', padding: '2px 8px',
              background: isAdmin ? 'rgba(15,98,254,0.2)' : 'rgba(66,190,101,0.2)',
              color: isAdmin ? '#78a9ff' : '#42be65',
              border: `1px solid ${isAdmin ? 'rgba(15,98,254,0.4)' : 'rgba(66,190,101,0.4)'}`,
              fontWeight: 500, letterSpacing: '0.04em',
            }}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </div>
            <span style={{ fontSize: '13px', color: '#8d8d8d' }}>{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid #525252',
              color: '#c6c6c6',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as any).style.background = '#da1e28';
              (e.currentTarget as any).style.borderColor = '#da1e28';
              (e.currentTarget as any).style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as any).style.background = 'transparent';
              (e.currentTarget as any).style.borderColor = '#525252';
              (e.currentTarget as any).style.color = '#c6c6c6';
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
