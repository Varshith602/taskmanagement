import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card card text-center">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The page or resource you are looking for doesn't exist or has been relocated.
        </p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            <Home size={18} />
            <span>Go to Dashboard</span>
          </Link>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
