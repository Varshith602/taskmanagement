import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'New Task', path: '/tasks/new', icon: PlusCircle },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <CheckCircle2 className="logo-icon" size={26} />
            </div>
            <span className="brand-title">TaskFlow</span>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user-card">
          <div className="avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Workspace User'}</div>
            <div className="sidebar-user-email">{user?.email || 'user@taskflow.dev'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MENU</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} className="nav-icon" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <span className="topbar-tagline">TaskFlow Workspace</span>
          </div>

          <div className="topbar-right">
            <div className="user-badge">
              <UserIcon size={16} />
              <span>{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  );
};
