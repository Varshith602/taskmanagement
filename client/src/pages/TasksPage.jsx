import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { taskService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { ConfirmDialog } from '../components/Modal';
import { Plus, ListTodo } from 'lucide-react';

export const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState(searchParams.get('priority') || 'All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
        priority: priority !== 'All' ? priority : undefined,
        sortBy,
        sortOrder,
      };

      const res = await taskService.getTasks(params);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, priority, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setSortBy('dueDate');
    setSortOrder('asc');
    setSearchParams({});
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setDeleting(true);
      await taskService.deleteTask(taskToDelete._id);
      addToast('Task deleted successfully', 'success');
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="tasks-page animate-fade-in">
      <div className="tasks-page-header">
        <div>
          <h1 className="page-heading">All Tasks</h1>
          <p className="page-subheading">Manage, filter, search, and track all your scheduled items.</p>
        </div>
        <Link to="/tasks/new" className="btn btn-primary">
          <Plus size={18} />
          <span>New Task</span>
        </Link>
      </div>

      <TaskFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="card loading-placeholder"><div className="spinner"></div><p>Loading your tasks...</p></div>
      ) : tasks.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon-wrap"><ListTodo size={40} /></div>
          <h3 className="empty-title">No tasks found</h3>
          <p className="empty-desc">
            {search || status !== 'All' || priority !== 'All'
              ? 'No tasks matched your current search or filter criteria. Try resetting filters.'
              : 'You have not added any tasks yet.'}
          </p>
          {search || status !== 'All' || priority !== 'All' ? (
            <button className="btn btn-secondary" onClick={handleResetFilters}>Reset Filters</button>
          ) : (
            <Link to="/tasks/new" className="btn btn-primary"><Plus size={16} /><span>Create Your First Task</span></Link>
          )}
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onSelectDetails={(t) => setSelectedTask(t)} onDeleteClick={(t) => setTaskToDelete(t)} />
          ))}
        </div>
      )}

      <TaskDetailsModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onDeleteClick={(t) => { setSelectedTask(null); setTaskToDelete(t); }} />
      <ConfirmDialog isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} onConfirm={handleDeleteTask} title="Delete Task" message={`Are you sure you want to delete "${taskToDelete?.title}"?`} confirmText="Yes, Delete" isLoading={deleting} />
    </div>
  );
};
