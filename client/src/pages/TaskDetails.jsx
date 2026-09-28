import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { ConfirmDialog } from '../components/Modal';
import { ArrowLeft, Calendar, Clock, Edit2, Trash2, Bell } from 'lucide-react';
import { isTaskOverdue, formatLongDate, formatDateTime } from '../utils/date';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await taskService.getTaskById(id);
        if (res.data.success) {
          setTask(res.data.task);
        }
      } catch (error) {
        addToast(error.response?.data?.message || 'Task not found', 'error');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate, addToast]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await taskService.deleteTask(id);
      addToast('Task deleted successfully', 'success');
      navigate('/tasks');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card loading-placeholder">
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (!task) return null;

  const isOverdue = isTaskOverdue(task);

  return (
    <div className="task-details-page animate-fade-in">
      <div className="details-page-header">
        <Link to="/tasks" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Tasks</span>
        </Link>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
          >
            <Edit2 size={16} />
            <span>Edit Task</span>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="card task-details-full-card">
        <div className="full-card-header">
          <div className="badges-row">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {task.reminderAt && (
              <span className="badge reminder-badge">
                <Bell size={12} />
                <span>Reminder: {formatDateTime(task.reminderAt)}</span>
              </span>
            )}
          </div>
          <h1 className="full-task-title">{task.title}</h1>
        </div>

        <div className="full-card-section">
          <h3 className="section-label">Description</h3>
          <div className="full-task-desc">
            {task.description ? (
              <p>{task.description}</p>
            ) : (
              <p className="text-muted">No description provided for this task.</p>
            )}
          </div>
        </div>

        <div className="full-card-meta-grid">
          <div className="meta-box">
            <span className="meta-box-label">Due Date</span>
            <div className={`meta-box-val ${isOverdue ? 'text-danger font-medium' : ''}`}>
              <Calendar size={16} />
              <span>{formatLongDate(task.dueDate)}</span>
              {isOverdue && <span className="overdue-tag">Overdue</span>}
            </div>
          </div>

          <div className="meta-box">
            <span className="meta-box-label">Reminder</span>
            <div className="meta-box-val">
              <Bell size={16} />
              <span>{task.reminderAt ? formatDateTime(task.reminderAt) : 'None configured'}</span>
            </div>
          </div>

          <div className="meta-box">
            <span className="meta-box-label">Created At</span>
            <div className="meta-box-val">
              <Clock size={16} />
              <span>{formatDateTime(task.createdAt)}</span>
            </div>
          </div>

          <div className="meta-box">
            <span className="meta-box-label">Last Updated</span>
            <div className="meta-box-val">
              <Clock size={16} />
              <span>{formatDateTime(task.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"?`}
        confirmText="Yes, Delete"
        isLoading={deleting}
      />
    </div>
  );
};

