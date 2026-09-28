import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'At least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      // Store the registered email for easy next-time direct login
      localStorage.setItem('taskflow_last_email', formData.email.trim());
      addToast('Account created successfully! Welcome to TaskFlow.', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-brand">
            <div className="logo-icon-wrapper"><CheckCircle2 className="logo-icon" size={26} /></div>
            <span className="brand-title">TaskFlow</span>
          </Link>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Get started with your free TaskFlow workspace</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                name="name"
                type="text"
                className={'form-input icon-input ' + (errors.name ? 'form-input-error' : '')}
                placeholder="Varshith Challa"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.name && <span className="field-error-message"><AlertCircle size={13} /> {errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                name="email"
                type="email"
                className={'form-input icon-input ' + (errors.email ? 'form-input-error' : '')}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="field-error-message"><AlertCircle size={13} /> {errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                name="password"
                type="password"
                className={'form-input icon-input ' + (errors.password ? 'form-input-error' : '')}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.password && <span className="field-error-message"><AlertCircle size={13} /> {errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                name="confirmPassword"
                type="password"
                className={'form-input icon-input ' + (errors.confirmPassword ? 'form-input-error' : '')}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && <span className="field-error-message"><AlertCircle size={13} /> {errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="auth-footer text-center">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in instead</Link></p>
        </div>
      </div>
    </div>
  );
};
