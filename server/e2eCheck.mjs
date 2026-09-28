/**
 * TaskFlow End-to-End API verification script.
 * Usage: node e2eCheck.mjs   (server must be running on port 5000)
 */
const BASE = 'http://127.0.0.1:5000/api';
const email = `demo${Date.now()}@taskflow.io`;
let token;
let pass = 0;
let fail = 0;

const req = async (method, path, body, overrideToken) => {
  const authToken = overrideToken === undefined ? token : overrideToken;
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
};

const log = (label, ok, extra = '') => {
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${label}${extra ? ' | ' + extra : ''}`);
};

const BASE_URL = BASE;

const run = async () => {
  let r = await req('GET', '/health');
  log('Health check', r.status === 200, `HTTP ${r.status}`);

  r = await req('POST', '/auth/register', { name: 'Demo User', email, password: 'Password123' });
  log('Register user', r.status === 201 && r.data?.success === true, `HTTP ${r.status}`);
  log('Register returns token + user', !!r.data?.token && r.data?.user?.email === email, `user=${r.data?.user?.email}`);
  token = r.data?.token;

  r = await req('POST', '/auth/login', { email, password: 'Password123' });
  log('Login user', r.status === 200 && !!r.data?.token, `HTTP ${r.status}`);
  token = r.data?.token || token;

  r = await req('GET', '/auth/me');
  log('Get profile (protected)', r.status === 200 && r.data?.user?.email === email, `HTTP ${r.status}, user=${r.data?.user?.email}`);

  r = await req('POST', '/tasks', {
    title: 'Design landing page',
    description: 'Create hero + features section',
    priority: 'High',
    status: 'Pending',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
  });
  log('Create task', r.status === 201 && !!r.data?.task?._id, `HTTP ${r.status}`);
  const taskId = r.data?.task?._id;

  r = await req('POST', '/tasks', {
    title: 'Write documentation',
    description: 'README + API docs',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
  });
  log('Create 2nd task', r.status === 201, `HTTP ${r.status}`);

  r = await req('GET', '/tasks');
  log('List tasks', r.status === 200 && r.data?.tasks?.length === 2, `HTTP ${r.status}, count=${r.data?.count}`);

  r = await req('GET', '/tasks?status=Pending');
  log('Filter by status=Pending', r.status === 200 && r.data?.tasks?.length === 1, `count=${r.data?.tasks?.length}`);

  r = await req('GET', '/tasks?priority=Low');
  log('Filter by priority=Low', r.status === 200 && r.data?.tasks?.length === 1, `count=${r.data?.tasks?.length}`);

  r = await req('GET', '/tasks?search=landing');
  log('Search title=landing', r.status === 200 && r.data?.tasks?.length === 1, `count=${r.data?.tasks?.length}`);

  r = await req('GET', '/tasks?sortBy=dueDate&sortOrder=desc');
  log(
    'Sort by dueDate desc',
    r.status === 200 && r.data?.tasks?.length === 2,
    `first=${r.data?.tasks?.[0]?.title}`
  );

  r = await req('GET', '/tasks/stats');
  let s = r.data?.stats;
  log(
    'Stats after 1 pending + 1 completed',
    r.status === 200 && s?.total === 2 && s?.pending === 1 && s?.completed === 1 && s?.overdue === 0,
    `total=${s?.total} pending=${s?.pending} inProgress=${s?.inProgress} completed=${s?.completed} overdue=${s?.overdue}`
  );
  log('Stats recentTasks returned', r.data?.recentTasks?.length === 2, `recent=${r.data?.recentTasks?.length}`);

  // Overdue: a non-completed task with a past due date must be counted
  r = await req('POST', '/tasks', {
    title: 'Overdue follow-up',
    description: 'Pending task with past due date',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
  });
  log('Create overdue task', r.status === 201, `HTTP ${r.status}`);
  const overdueId = r.data?.task?._id;

  r = await req('GET', '/tasks/stats');
  s = r.data?.stats;
  log('Overdue counted for pending task', s?.overdue === 1, `overdue=${s?.overdue} total=${s?.total}`);

  // Regression: a task due *today* must NOT be flagged overdue (the due day is inclusive)
  const today = new Date().toISOString().split('T')[0];
  r = await req('POST', '/tasks', {
    title: 'Due today task',
    description: 'Must not be flagged overdue',
    priority: 'Low',
    status: 'Pending',
    dueDate: today,
  });
  log('Create task due today', r.status === 201, `HTTP ${r.status}, dueDate=${today}`);
  const todayId = r.data?.task?._id;

  r = await req('GET', '/tasks/stats');
  log('Task due today is NOT overdue', r.data?.stats?.overdue === 1, `overdue=${r.data?.stats?.overdue}`);

  r = await req('DELETE', `/tasks/${todayId}`);
  log('Cleanup due-today task', r.status === 200, `HTTP ${r.status}`);

  r = await req('DELETE', `/tasks/${overdueId}`);
  log('Cleanup overdue task', r.status === 200, `HTTP ${r.status}`);

  r = await req('GET', '/tasks');
  log('Back to 2 tasks after cleanup', r.data?.tasks?.length === 2, `count=${r.data?.tasks?.length}`);

  r = await req('GET', `/tasks/${taskId}`);
  log('Get task by id', r.status === 200 && r.data?.task?.title === 'Design landing page', `HTTP ${r.status}`);

  r = await req('PUT', `/tasks/${taskId}`, { status: 'In Progress', priority: 'Medium' });
  log('Update task', r.status === 200 && r.data?.task?.status === 'In Progress', `status=${r.data?.task?.status}`);

  r = await req('POST', '/tasks', { title: 'x' });
  log('Validation rejects task without due date', r.status === 400, `HTTP ${r.status}`);

  const noAuth = await fetch(`${BASE_URL}/tasks`);
  log('Protected route blocked without token', noAuth.status === 401, `HTTP ${noAuth.status}`);

  // Cross-user isolation: second account must not access the first user's task
  const email2 = `isolated${Date.now()}@taskflow.io`;
  let r2 = await req('POST', '/auth/register', { name: 'Other User', email: email2, password: 'Password123' });
  const token2 = r2.data?.token;
  r2 = await req('GET', `/tasks/${taskId}`, null, token2);
  log('Other user cannot view foreign task', r2.status === 403, `HTTP ${r2.status}`);
  r2 = await req('DELETE', `/tasks/${taskId}`, null, token2);
  log('Other user cannot delete foreign task', r2.status === 403, `HTTP ${r2.status}`);
  r2 = await req('GET', '/tasks', null, token2);
  log('Other user sees own empty list', r2.status === 200 && r2.data?.tasks?.length === 0, `count=${r2.data?.tasks?.length}`);

  r = await req('DELETE', `/tasks/${taskId}`);
  log('Delete task', r.status === 200, `HTTP ${r.status}`);

  r = await req('GET', '/tasks');
  log('Confirm deletion', r.status === 200 && r.data?.tasks?.length === 1, `remaining=${r.data?.tasks?.length}`);

  r = await req('POST', '/auth/login', { email, password: 'WrongPassword' });
  log('Reject bad credentials', r.status === 401, `HTTP ${r.status}`);

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  return fail;
};

let failed = 1;
try {
  failed = await run();
} catch (err) {
  console.log('SCRIPT ERROR:', err.message);
}
process.exit(failed > 0 ? 1 : 0);
