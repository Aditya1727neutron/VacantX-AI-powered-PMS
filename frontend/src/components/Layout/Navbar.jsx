import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Home, Map, BarChart3, Settings, Sun, Moon } from 'lucide-react';
import logoSvg from '../../assets/logo.svg';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <img src={logoSvg} className="brand-logo" alt="" />
          <span className="brand-text">
            Vacant<span className="brand-accent">X</span>
          </span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            <Home size={16} /> Home
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <Map size={16} /> Parking Map
          </NavLink>
          <NavLink to="/predictions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <BarChart3 size={16} /> Predictions
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Settings size={16} /> Admin
            </NavLink>
          )}
        </div>

        <div className="navbar-right">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="user-menu">
              <span className="user-badge">
                <span className="user-avatar">{user.username[0].toUpperCase()}</span>
                {user.username}
              </span>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
