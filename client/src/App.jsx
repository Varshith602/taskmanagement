import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Page Components
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { TaskDetails } from './pages/TaskDetails';
import { CreateTask, EditTask } from './pages/TaskFormPages';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <Routes>
      {/* Public Landing & Marketing */}
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <Landing />
          </PublicOnlyRoute>
        }
      />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Application Workspace */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Tasks />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateTask />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TaskDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/edit/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditTask />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
