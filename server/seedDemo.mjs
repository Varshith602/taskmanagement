/**
 * Seeds a demo account + sample tasks for manual/visual verification.
 * Prints the credentials and JWT as JSON so screenshot tooling can reuse them.
 */
const BASE = 'http://127.0.0.1:5000/api';

const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * DAY).toISOString();

const CREDENTIALS = {
  name: 'Varshith Challa',
  email: 'demo@taskflow.dev',
  password: 'Password123',
};

async function call(method, path, body, token) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
}

const tasks = [
  { title: 'Design the landing page hero', description: 'Craft the hero section, gradient headline and CTA buttons for the marketing page.', priority: 'High', status: 'In Progress', dueDate: iso(2) },
  { title: 'Implement JWT authentication', description: 'Register/login endpoints, bcrypt hashing and protected middleware.', priority: 'High', status: 'Completed', dueDate: iso(-4) },
  { title: 'Write API documentation', description: 'Document every REST endpoint with request/response examples.', priority: 'Medium', status: 'Pending', dueDate: iso(6) },
  { title: 'Fix overdue badge timezone bug', description: 'Due-day comparison must be inclusive so tasks due today are not flagged.', priority: 'High', status: 'Pending', dueDate: iso(-2) },
  { title: 'Polish dashboard statistics cards', description: 'Add colour-coded icons and hover lift to the stat cards.', priority: 'Medium', status: 'In Progress', dueDate: iso(1) },
  { title: 'Add responsive sidebar drawer', description: 'Off-canvas navigation for tablet and mobile breakpoints.', priority: 'Low', status: 'Completed', dueDate: iso(-1) },
  { title: 'Audit filter and sort controls', description: 'Verify search, status, priority filters and sort order toggling.', priority: 'Low', status: 'Pending', dueDate: iso(9) },
  { title: 'Prepare final demo walkthrough', description: 'Rehearse the end-to-end flow: register → create → filter → complete.', priority: 'Medium', status: 'Pending', dueDate: iso(3) },
];

(async () => {
  let res = await call('POST', '/auth/register', CREDENTIALS);
  if (res.status !== 201) {
    res = await call('POST', '/auth/login', {
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
    });
  }
  const token = res.data?.token;
  if (!token) {
    console.error('Could not obtain a token:', res.status, res.data);
    process.exit(1);
  }

  for (const task of tasks) {
    const created = await call('POST', '/tasks', task, token);
    if (created.status !== 201) console.error('Failed:', task.title, created.status);
  }

  const stats = await call('GET', '/tasks/stats', null, token);
  console.log(
    JSON.stringify(
      { email: CREDENTIALS.email, password: CREDENTIALS.password, token, stats: stats.data?.stats },
      null,
      2
    )
  );
})();
