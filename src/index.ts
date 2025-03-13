import { Hono } from 'hono';
import { Reminder, reminders } from './reminder.js';

const app = new Hono();

// Create a reminder
app.post('/reminders', async (c) => {
  try {
    const body: Reminder = await c.req.json();
    if (!body.id || !body.title || !body.dueDate || typeof body.isCompleted !== 'boolean') {
      return c.json({ error: 'Invalid input' }, 400);
    }
    reminders.push(body);
    return c.json(body, 201);
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

// Get a reminder by ID
app.get('/reminders/:id', (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find(r => r.id === id);
  return reminder ? c.json(reminder) : c.json({ error: 'Reminder not found' }, 404);
});

// Get all reminders
app.get('/reminders', (c) => {
  return reminders.length ? c.json(reminders) : c.json({ error: 'No reminders found' }, 404);
});

// Update a reminder
app.patch('/reminders/:id', async (c) => {
  const id = c.req.param('id');
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return c.json({ error: 'Reminder not found' }, 404);

  try {
    const body = await c.req.json();
    reminders[index] = { ...reminders[index], ...body };
    return c.json(reminders[index]);
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

// Delete a reminder
app.delete('/reminders/:id', (c) => {
  const id = c.req.param('id');
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) return c.json({ error: 'Reminder not found' }, 404);

  reminders.splice(index, 1);
  return c.json({ message: 'Reminder deleted' });
});

// Mark as completed
app.post('/reminders/:id/mark-completed', (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find(r => r.id === id);
  if (!reminder) return c.json({ error: 'Reminder not found' }, 404);

  reminder.isCompleted = true;
  return c.json(reminder);
});

// Unmark as completed
app.post('/reminders/:id/unmark-completed', (c) => {
  const id = c.req.param('id');
  const reminder = reminders.find(r => r.id === id);
  if (!reminder) return c.json({ error: 'Reminder not found' }, 404);

  reminder.isCompleted = false;
  return c.json(reminder);
});

// Get completed reminders
app.get('/reminders/completed', (c) => {
  const completed = reminders.filter(r => r.isCompleted);
  return completed.length ? c.json(completed) : c.json({ error: 'No completed reminders' }, 404);
});

// Get not completed reminders
app.get('/reminders/not-completed', (c) => {
  const notCompleted = reminders.filter(r => !r.isCompleted);
  return notCompleted.length ? c.json(notCompleted) : c.json({ error: 'No uncompleted reminders' }, 404);
});

// Get reminders due today
app.get('/reminders/due-today', (c) => {
  const today = new Date().toISOString().split('T')[0];
  const dueToday = reminders.filter(r => r.dueDate.startsWith(today));
  return dueToday.length ? c.json(dueToday) : c.json({ error: 'No reminders due today' }, 404);
});

export default app;
