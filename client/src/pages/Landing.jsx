import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap, Layers, TrendingUp, ShieldCheck } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-container nav-container">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <CheckCircle2 className="logo-icon" size={26} />
            </div>
            <span className="brand-title">TaskFlow</span>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="landing-container hero-container">
          <div className="hero-tag">
            <span className="tag-pulse"></span>
            Professional Productivity Workspace
          </div>
          <h1 className="hero-headline">
            Plan. Track. <span className="text-gradient">Complete.</span>
          </h1>
          <p className="hero-description">
            TaskFlow is a modern, intuitive task management system designed to streamline your daily workflow, eliminate missed deadlines, and keep your goals in focus with real-time statistics.
          </p>

          <div className="hero-cta-group">
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Start Organizing Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Existing Account
            </Link>
          </div>

          <div className="hero-preview-wrapper animate-fade-in">
            <div className="preview-top-bar">
              <div className="preview-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="preview-title">TaskFlow Dashboard Preview</div>
              <div></div>
            </div>
            <div className="preview-content-grid">
              <div className="preview-stat-card">
                <span className="p-stat-label">Total Tasks</span>
                <span className="p-stat-val text-primary">24</span>
              </div>
              <div className="preview-stat-card">
                <span className="p-stat-label">In Progress</span>
                <span className="p-stat-val text-warning">8</span>
              </div>
              <div className="preview-stat-card">
                <span className="p-stat-label">Completed</span>
                <span className="p-stat-val text-success">14</span>
              </div>
              <div className="preview-stat-card">
                <span className="p-stat-label">Overdue</span>
                <span className="p-stat-val text-danger">2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <h2 className="section-title">Built for Modern Productivity</h2>
            <p className="section-subtitle">Everything you need to deliver projects on schedule with zero clutter.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box icon-blue"><Zap size={24} /></div>
              <h3 className="feature-card-title">Effortless Task CRUD</h3>
              <p className="feature-card-desc">Create, organize, update, and manage tasks with structured priorities, statuses, and due dates in seconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-purple"><Layers size={24} /></div>
              <h3 className="feature-card-title">Instant Search & Filters</h3>
              <p className="feature-card-desc">Find any task effortlessly by title, filter by completion stage or priority, and sort by upcoming deadlines.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-green"><TrendingUp size={24} /></div>
              <h3 className="feature-card-title">Insightful Dashboard</h3>
              <p className="feature-card-desc">Stay updated with interactive cards tracking pending items, active progress, overdue alerts, and recent activities.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box icon-amber"><ShieldCheck size={24} /></div>
              <h3 className="feature-card-title">Robust JWT Security</h3>
              <p className="feature-card-desc">Protected API routes, bcrypt password hashing, and user data isolation ensure each user accesses strictly their tasks.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container footer-content">
          <div className="brand-logo">
            <div className="logo-icon-wrapper"><CheckCircle2 className="logo-icon" size={20} /></div>
            <span className="brand-title">TaskFlow</span>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} TaskFlow. Full-Stack Task Management System.
          </p>
        </div>
      </footer>
    </div>
  );
};
