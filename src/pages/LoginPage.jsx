import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import logo from '../assets/amigo png logo.png';
import './LoginPage.css';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'amigo2025';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        localStorage.setItem('amigo_admin', '1');
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid username or password.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-page__glow login-page__glow--1" />
        <div className="login-page__glow login-page__glow--2" />
        <div className="login-page__grid" />
      </div>

      <div className="login-page__card">
        <img src={logo} alt="Amigo's Fitness Gym" className="login-page__logo" />

        <div className="login-page__header">
          <h1 className="login-page__title">ADMIN LOGIN</h1>
          <p className="login-page__sub">Authorized personnel only</p>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              className="login-input"
              placeholder="Enter username"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                className="login-input login-input--pass"
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <LogIn size={16} strokeWidth={2.5} />
                Sign In
              </>
            )}
          </button>
        </form>

        <Link to="/" className="login-back">
          <ArrowLeft size={14} />
          Back to site
        </Link>
      </div>
    </div>
  );
}
