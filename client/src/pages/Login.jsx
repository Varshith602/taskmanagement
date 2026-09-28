import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Prefill the email of the most recently used/registered account so
  // users can log in directly with their previously created account
  useEffect(() => {
    const lastEmail = localStorage.getItem('taskflow_last_email');
    if (lastEmail) {
      setEmail(lastEmail);
    }
  }, []);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await login(email, password);
      // Remember this email for quick direct login next time
      localStorage.setItem('taskflow_last_email', email.trim());
      addToast('Welcome back to TaskFlow!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-brand">
            <div className="logo-icon-wrapper">
              <CheckCircle2 className="logo-icon" size={26} />
            </div>
            <span className="brand-title">TaskFlow</span>
          </Link>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                className={`form-input icon-input ${errors.email ? 'form-input-error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="field-error-message">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                className={`form-input icon-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className="field-error-message">
                <AlertCircle size={13} /> {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="auth-footer text-center">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

