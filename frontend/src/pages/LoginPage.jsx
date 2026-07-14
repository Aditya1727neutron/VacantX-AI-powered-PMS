import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ParkingCircle, Loader2, UserPlus, LogIn } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, email, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container fade-in">
        <div className="login-card glass-card">
          <div className="login-header">
            <span className="login-logo-wrap"><ParkingCircle size={32} /></span>
            <h2>
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p>
              {isRegister
                ? 'Register to access Smart Parking'
                : 'Sign in to your Smart Parking account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 size={16} className="spin-icon" /> Please wait...</>
              ) : isRegister ? (
                <><UserPlus size={16} /> Create Account</>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button
                className="toggle-auth-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </p>
          </div>

          <div className="demo-credentials">
            <span className="demo-label">Demo Accounts</span>
            <div className="demo-creds-list">
              <span className="demo-cred">
                <strong>Admin:</strong> admin / admin123
              </span>
              <span className="demo-cred">
                <strong>Student:</strong> student / student123
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
