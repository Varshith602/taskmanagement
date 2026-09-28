import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, Edit2, Trash2, Bell } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badges';
import { isTaskOverdue, formatShortDate, formatRelativeTime } from '../utils/date';

export const TaskCard = ({ task, onSelectDetails, onDeleteClick }) => {
  const navigate = useNavigate();

  const formattedDueDate = formatShortDate(task.dueDate);
  const isOverdue = isTaskOverdue(task);
  const hasReminder = !!task.reminderAt && task.status !== 'Completed';
  const reminderDue = hasReminder && new Date(task.reminderAt).getTime() <= Date.now() && !task.reminderDismissed;

  return (
    <div className={`task-card ${isOverdue ? 'task-card-overdue' : ''} ${reminderDue ? 'task-card-reminder-alert' : ''}`}>
      <div className="task-card-header">
        <div className="header-badges-left">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
        {hasReminder && (
          <div className={`card-reminder-pill ${reminderDue ? 'reminder-pill-active' : ''}`} title={`Reminder: ${new Date(task.reminderAt).toLocaleString()}`}>
            <Bell size={12} className={reminderDue ? 'bell-shake' : ''} />
            <span>{reminderDue ? 'Reminder Due!' : formatRelativeTime(task.reminderAt)}</span>
          </div>
        )}
      </div>

      <div className="task-card-body">
        <h4
          className="task-card-title"
          onClick={() => onSelectDetails(task)}
          title="Click to view details"
        >
          {task.title}
        </h4>
        <p className="task-card-desc">
          {task.description
            ? task.description.length > 95
              ? `${task.description.slice(0, 95)}...`
              : task.description
            : 'No description provided.'}
        </p>
      </div>

      <div className="task-card-footer">
        <div className={`task-card-date ${isOverdue ? 'date-overdue' : ''}`}>
          <Calendar size={14} />
          <span>{formattedDueDate}</span>
          {isOverdue && <span className="overdue-tag">Overdue</span>}
        </div>

        <div className="task-card-actions">
          <button
            className="card-action-btn view-btn"
            title="View Details"
            onClick={() => onSelectDetails(task)}
          >
            <Eye size={16} />
          </button>
          <button
            className="card-action-btn edit-btn"
            title="Edit Task"
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="card-action-btn delete-btn"
            title="Delete Task"
            onClick={() => onDeleteClick(task)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

