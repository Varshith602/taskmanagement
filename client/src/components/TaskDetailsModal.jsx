import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit2, Trash2, Bell } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badges';
import { Modal } from './Modal';
import { isTaskOverdue, formatLongDate, formatDateTime } from '../utils/date';

export const TaskDetailsModal = ({ task, isOpen, onClose, onDeleteClick }) => {
  const navigate = useNavigate();

  if (!task) return null;

  const isOverdue = isTaskOverdue(task);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" maxWidth="600px">
      <div className="task-details-view">
        <div className="details-header-badges">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          {task.reminderAt && (
            <span className="badge reminder-badge">
              <Bell size={12} />
              <span>Reminder: {formatDateTime(task.reminderAt)}</span>
            </span>
          )}
        </div>

        <h3 className="details-title">{task.title}</h3>

        <div className="details-section">
          <label className="details-label">Description</label>
          <div className="details-description">
            {task.description ? (
              <p>{task.description}</p>
            ) : (
              <p className="text-muted">No description was entered for this task.</p>
            )}
          </div>
        </div>

        <div className="details-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Due Date</span>
            <div className={`meta-value ${isOverdue ? 'text-danger font-medium' : ''}`}>
              <Calendar size={16} />
              <span>{formatLongDate(task.dueDate)}</span>
              {isOverdue && <span className="overdue-tag">Overdue</span>}
            </div>
          </div>

          <div className="meta-item">
            <span className="meta-label">Reminder</span>
            <div className="meta-value">
              <Bell size={16} />
              <span>{task.reminderAt ? formatDateTime(task.reminderAt) : 'None set'}</span>
            </div>
          </div>

          <div className="meta-item">
            <span className="meta-label">Created At</span>
            <div className="meta-value">
              <Clock size={16} />
              <span>{formatLongDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="meta-item">
            <span className="meta-label">Last Updated</span>
            <div className="meta-value">
              <Clock size={16} />
              <span>{formatLongDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <div className="details-right-actions">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onClose();
                onDeleteClick(task);
              }}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                navigate(`/tasks/edit/${task._id}`);
              }}
            >
              <Edit2 size={16} />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

