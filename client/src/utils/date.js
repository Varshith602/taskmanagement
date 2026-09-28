/**
 * Shared date helpers for TaskFlow.
 *
 * `dueDate` is persisted as midnight UTC of the day selected in the form
 * (e.g. "2025-04-10T00:00:00.000Z"). Comparing that raw instant against the
 * current time makes tasks look overdue from midnight UTC onwards, which is
 * wrong for every timezone behind UTC. The helpers below treat the whole
 * chosen day as inclusive instead, and are used by the UI and mirrored by the
 * backend stats endpoint so the dashboard and the cards always agree.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * A task is overdue when it is still open and its due day has fully passed.
 */
export const isTaskOverdue = (task) => {
  if (!task || task.status === 'Completed') return false;
  const due = toDate(task.dueDate);
  if (!due) return false;
  return due.getTime() + DAY_MS < Date.now();
};

/** "Apr 10, 2025" */
export const formatShortDate = (value) => {
  const date = toDate(value);
  if (!date) return 'No due date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/** "Thu, Apr 10, 2025" */
export const formatLongDate = (value) => {
  const date = toDate(value);
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/** "Apr 10, 2025, 06:30 PM" */
export const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return 'N/A';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** "2025-04-10" — the value shape required by <input type="date" /> */
export const toDateInputValue = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${date.getUTCFullYear()}-${month}-${day}`;
};

/** "2025-04-10T14:30" — the value shape required by <input type="datetime-local" /> */

export const toDateTimeLocalValue = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

/** Relative time string: "in 2 hours", "10 minutes ago", "Tomorrow" */
export const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) return '';
  const diffMs = date.getTime() - Date.now();
  const isPast = diffMs < 0;
  const absSec = Math.floor(Math.abs(diffMs) / 1000);
  const absMin = Math.floor(absSec / 60);
  const absHours = Math.floor(absMin / 60);
  const absDays = Math.floor(absHours / 24);

  if (absSec < 60) return isPast ? 'just now' : 'in less than a minute';
  if (absMin < 60) return isPast ? `${absMin}m ago` : `in ${absMin}m`;
  if (absHours < 24) return isPast ? `${absHours}h ago` : `in ${absHours}h`;
  if (absDays === 1) return isPast ? 'yesterday' : 'tomorrow';
  return isPast ? `${absDays}d ago` : `in ${absDays}d`;
};

