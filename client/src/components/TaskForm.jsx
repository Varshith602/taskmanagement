import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Save, AlertCircle, Bell, Clock } from 'lucide-react';
import { toDateInputValue, toDateTimeLocalValue } from '../utils/date';

export const TaskForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    reminderAt: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode && id) {
      taskService.getTaskById(id)
        .then((res) => {
          if (res.data.success) {
            const t = res.data.task;
            setFormData({
              title: t.title || '',
              description: t.description || '',
              priority: t.priority || 'Medium',
              status: t.status || 'Pending',
              dueDate: toDateInputValue(t.dueDate),
              reminderAt: t.reminderAt ? toDateTimeLocalValue(t.reminderAt) : '',
            });
          }
        })
        .catch((err) => {
          addToast(err.response?.data?.message || 'Failed to load task', 'error');
          navigate('/tasks');
        })
        .finally(() => setFetching(false));
    }
  }, [isEditMode, id, navigate, addToast]);


  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Quick preset helper to set a reminder relative to right now
  const setQuickReminder = (minutesFromNow) => {
    const target = new Date(Date.now() + minutesFromNow * 60 * 1000);
    setFormData((prev) => ({ ...prev, reminderAt: toDateTimeLocalValue(target) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return addToast('Please fill out required fields', 'warning');
    try {
      setLoading(true);
      const payload = {
        ...formData,
        reminderAt: formData.reminderAt || null,
      };
      if (isEditMode) {
        await taskService.updateTask(id, payload);
        addToast('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(payload);
        addToast('Task created successfully!', 'success');
      }
      navigate('/tasks');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save task', 'error');
    } finally {
      setLoading(false);
    }
  };


  if (fetching) {
    return <div className="card loading-placeholder"><div className="spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="form-page-container">
      <div className="form-page-header">
        <Link to="/tasks" className="back-link"><ArrowLeft size={18} /><span>Back to Tasks</span></Link>
        <h1 className="page-heading">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
      </div>
      <div className="card form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Task Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className={'form-input ' + (errors.title ? 'form-input-error' : '')}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement authentication"
              disabled={loading}
              maxLength={120}
            />
            {errors.title && <span className="field-error-message"><AlertCircle size={13} /> {errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Context or acceptance criteria..."
              disabled={loading}
              maxLength={1000}
            />
          </div>

          <div className="form-row-three">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={formData.priority} onChange={handleChange} disabled={loading}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange} disabled={loading}>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                name="dueDate"
                type="date"
                className={'form-input ' + (errors.dueDate ? 'form-input-error' : '')}
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.dueDate && <span className="field-error-message"><AlertCircle size={13} /> {errors.dueDate}</span>}
            </div>
          </div>

          {/* Reminder Section */}
          <div className="reminder-box">
            <div className="reminder-box-header">
              <div className="reminder-title-wrap">
                <Bell size={18} className="reminder-icon" />
                <span className="reminder-title">Set Reminder (Optional)</span>
              </div>
              <span className="reminder-hint">Get an alert when this task is due</span>
            </div>

            <div className="reminder-inputs-row">
              <div className="form-group reminder-input-group">
                <label className="form-label">Reminder Date & Time</label>
                <input
                  name="reminderAt"
                  type="datetime-local"
                  className="form-input"
                  value={formData.reminderAt}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="reminder-quick-presets">
                <span className="presets-label">Quick presets:</span>
                <div className="preset-buttons">
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => setQuickReminder(30)}
                    disabled={loading}
                  >
                    +30m
                  </button>
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => setQuickReminder(60)}
                    disabled={loading}
                  >
                    +1h
                  </button>
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => setQuickReminder(240)}
                    disabled={loading}
                  >
                    +4h
                  </button>
                  <button
                    type="button"
                    className="preset-pill"
                    onClick={() => setQuickReminder(1440)}
                    disabled={loading}
                  >
                    Tomorrow
                  </button>
                  {formData.reminderAt && (
                    <button
                      type="button"
                      className="preset-pill preset-clear"
                      onClick={() => setFormData((p) => ({ ...p, reminderAt: '' }))}
                      disabled={loading}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/tasks')} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}><Save size={16} /><span style={{ marginLeft: 6 }}>{loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}</span></button>
          </div>
        </form>

      </div>
    </div>
  );
};

