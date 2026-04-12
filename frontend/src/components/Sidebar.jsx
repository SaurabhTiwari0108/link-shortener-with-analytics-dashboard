import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.9rem 1.2rem',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    marginBottom: '0.5rem',
  };

  const activeStyle = {
    background: 'var(--primary-gradient)',
    color: '#fff',
    boxShadow: '0 4px 15px -3px var(--primary)'
  };

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '3rem', fontSize: '1.75rem', fontWeight: 'bold', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Linklytics
      </div>

      <nav style={{ flex: 1 }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => (isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle)}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button className="btn btn-secondary" onClick={toggleTheme} style={{ justifyContent: 'flex-start' }}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>

        <button className="btn btn-secondary" onClick={logout} style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
