const Task = require('../models/Task');

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A task is overdue when it is still open and its due day has fully passed.
 * `dueDate` is stored as midnight UTC of the selected day, so one day is added
 * to treat the whole due day as inclusive. The client mirrors this rule in
 * `client/src/utils/date.js` so the dashboard and the task cards always agree.
 */
const isOverdue = (task, now) => {
  if (task.status === 'Completed') return false;
  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() + DAY_MS < now.getTime();
};

// @desc    Get all tasks for current user with search, filter, and sort
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy, sortOrder } = req.query;
    const query = { user: req.user.id };

    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    let sort = {};
    if (sortBy === 'createdAt') {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.dueDate = sortOrder === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find(query).sort(sort);
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for current user
// @route   GET /api/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const tasks = await Task.find({ user: userId });

    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const overdue = tasks.filter((t) => isOverdue(t, now)).length;

    // Active reminders: tasks not completed, reminderAt set, and not dismissed
    const activeReminders = tasks.filter(
      (t) =>
        t.status !== 'Completed' &&
        t.reminderAt &&
        !t.reminderDismissed &&
        new Date(t.reminderAt).getTime() <= now.getTime()
    );

    const upcomingReminders = tasks
      .filter(
        (t) =>
          t.status !== 'Completed' &&
          t.reminderAt &&
          new Date(t.reminderAt).getTime() > now.getTime()
      )
      .sort((a, b) => new Date(a.reminderAt) - new Date(b.reminderAt))
      .slice(0, 5);

    const recentTasks = await Task.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
        overdue,
        dueRemindersCount: activeReminders.length,
      },
      activeReminders,
      upcomingReminders,
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, reminderAt } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ success: false, message: 'Due date is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      reminderAt: reminderAt ? new Date(reminderAt) : null,
      reminderDismissed: false,
      user: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this task' });
    }

    const { title, description, priority, status, dueDate, reminderAt, reminderDismissed } = req.body;
    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (reminderAt !== undefined) {
      updateFields.reminderAt = reminderAt ? new Date(reminderAt) : null;
      // If user sets a new reminder, reset the dismissed flag
      if (reminderAt) updateFields.reminderDismissed = false;
    }
    if (reminderDismissed !== undefined) {
      updateFields.reminderDismissed = !!reminderDismissed;
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Dismiss reminder for a task
// @route   POST /api/tasks/:id/dismiss-reminder
// @access  Private
exports.dismissReminder = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    task.reminderDismissed = true;
    await task.save();

    res.status(200).json({ success: true, message: 'Reminder dismissed', task });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};
