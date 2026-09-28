import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { TaskCard } from '../components/TaskCard';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { ConfirmDialog } from '../components/Modal';
import {
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Bell,
  Check,
  X,
} from 'lucide-react';
import { formatRelativeTime, formatDateTime } from '../utils/date';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    dueRemindersCount: 0,
  });
  const [activeReminders, setActiveReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTaskStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setActiveReminders(res.data.activeReminders || []);
        setUpcomingReminders(res.data.upcomingReminders || []);
        setRecentTasks(res.data.recentTasks || []);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDismissReminder = async (taskId) => {
    try {
      await taskService.dismissReminder(taskId);
      addToast('Reminder dismissed', 'info');
      setActiveReminders((prev) => prev.filter((r) => r._id !== taskId));
      setStats((prev) => ({
        ...prev,
        dueRemindersCount: Math.max(0, (prev.dueRemindersCount || 1) - 1),
      }));
    } catch (err) {
      addToast('Failed to dismiss reminder', 'error');
    }
  };

  const handleCompleteTaskFromReminder = async (task) => {
    try {
      await taskService.updateTask(task._id, { status: 'Completed', reminderDismissed: true });
      addToast(`"${task.title}" marked as Completed!`, 'success');
      fetchDashboardData();
    } catch (err) {
      addToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await taskService.deleteTask(taskToDelete._id);
      addToast('Task deleted successfully', 'success');
      setTaskToDelete(null);
      fetchDashboardData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-hero card">
        <div className="dashboard-hero-text">
          <div className="hero-badge-pill">
            <span className="hero-status-dot"></span>
            Workspace Active
          </div>
          <h1 className="hero-greeting">Welcome back, <span className="highlight-name">{user?.name?.split(' ')[0] || 'User'}</span> 👋</h1>
          <p className="hero-subtitle">Here is your daily activity overview, priority alerts, and scheduled reminders.</p>
        </div>
        <div className="dashboard-hero-action">
          <Link to="/tasks/new" className="btn btn-primary btn-glow"><Plus size={18} /><span>Create Task</span></Link>
        </div>
      </div>

      {/* Active Reminders Alert Banner */}
      {activeReminders.length > 0 && (
        <div className="reminders-alert-banner">
          <div className="reminders-alert-header">
            <div className="alert-header-left">
              <div className="alert-bell-pulse">
                <Bell size={20} className="bell-shake" />
              </div>
              <div>
                <h3 className="alert-title">
                  {activeReminders.length} Reminder{activeReminders.length > 1 ? 's' : ''} Due Now!
                </h3>
                <p className="alert-subtitle">Don't miss these scheduled action items:</p>
              </div>
            </div>
          </div>

          <div className="active-reminders-list">
            {activeReminders.map((task) => (
              <div key={task._id} className="active-reminder-item">
                <div className="active-reminder-info" onClick={() => setSelectedTask(task)}>
                  <span className="reminder-task-title">{task.title}</span>
                  <span className="reminder-task-meta">
                    Scheduled for {formatDateTime(task.reminderAt)} ({formatRelativeTime(task.reminderAt)})
                  </span>
                </div>
                <div className="active-reminder-actions">
                  <button
                    className="btn btn-sm btn-success-soft"
                    title="Mark task completed"
                    onClick={() => handleCompleteTaskFromReminder(task)}
                  >
                    <Check size={14} />
                    <span>Done</span>
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    title="Dismiss reminder"
                    onClick={() => handleDismissReminder(task._id)}
                  >
                    <X size={14} />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card stat-total card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon-wrap icon-blue"><ListTodo size={22} /></div>
          <div className="stat-info"><span className="stat-label">Total Tasks</span><span className="stat-value">{loading ? '...' : stats.total}</span></div>
        </div>
        <div className="stat-card stat-pending card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon-wrap icon-amber"><Clock size={22} /></div>
          <div className="stat-info"><span className="stat-label">Pending</span><span className="stat-value">{loading ? '...' : stats.pending}</span></div>
        </div>
        <div className="stat-card stat-inprogress card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon-wrap icon-purple"><PlayCircle size={22} /></div>
          <div className="stat-info"><span className="stat-label">In Progress</span><span className="stat-value">{loading ? '...' : stats.inProgress}</span></div>
        </div>
        <div className="stat-card stat-completed card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon-wrap icon-green"><CheckCircle2 size={22} /></div>
          <div className="stat-info"><span className="stat-label">Completed</span><span className="stat-value">{loading ? '...' : stats.completed}</span></div>
        </div>
        <div className="stat-card stat-overdue card" onClick={() => navigate('/tasks')}>
          <div className="stat-icon-wrap icon-red"><AlertTriangle size={22} /></div>
          <div className="stat-info"><span className="stat-label">Overdue</span><span className="stat-value">{loading ? '...' : stats.overdue}</span></div>
        </div>
      </div>

      {/* Upcoming Reminders Section */}
      {upcomingReminders.length > 0 && (
        <div className="dashboard-section upcoming-reminders-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">
                <Bell size={18} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8, color: 'var(--primary)' }} />
                Scheduled Reminders
              </h2>
              <p className="section-desc">Upcoming tasks with configured alert timers</p>
            </div>
          </div>
          <div className="upcoming-reminders-chips">
            {upcomingReminders.map((t) => (
              <div
                key={t._id}
                className="upcoming-chip"
                onClick={() => setSelectedTask(t)}
                title="Click to view details"
              >
                <div className="chip-left">
                  <span className="chip-priority-dot dot-priority" data-p={t.priority}></span>
                  <span className="chip-title">{t.title}</span>
                </div>
                <div className="chip-time">
                  <Clock size={13} />
                  <span>{formatRelativeTime(t.reminderAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      <div className="dashboard-section">
        <div className="section-title-row">
          <div><h2 className="section-title">Recent Tasks</h2><p className="section-desc">Recently created items in your workspace</p></div>
          <Link to="/tasks" className="btn btn-ghost btn-sm view-all-link"><span>View All</span><ArrowRight size={16} /></Link>
        </div>

        {loading ? (
          <div className="card loading-placeholder"><div className="spinner"></div><p>Loading recent tasks...</p></div>
        ) : recentTasks.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-wrap"><ListTodo size={40} /></div>
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-desc">You haven't created any tasks yet.</p>
            <Link to="/tasks/new" className="btn btn-primary"><Plus size={16} /><span>Create Task</span></Link>
          </div>
        ) : (
          <div className="task-grid">
            {recentTasks.map((t) => (
              <TaskCard key={t._id} task={t} onSelectDetails={(item) => setSelectedTask(item)} onDeleteClick={(item) => setTaskToDelete(item)} />
            ))}
          </div>
        )}
      </div>

      <TaskDetailsModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onDeleteClick={(t) => { setSelectedTask(null); setTaskToDelete(t); }} />
      <ConfirmDialog isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} title="Delete Task" message={`Are you sure you want to delete "${taskToDelete?.title}"?`} confirmText="Yes, Delete" isLoading={deleting} />
    </div>
  );
};

