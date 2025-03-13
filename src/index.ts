import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Reminder, reminders } from './reminder'; 


const app = new Hono();


app.post('/reminders', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Creating reminder:', body); 

  
    if (!body.id || !body.title || !body.dueDate || typeof body.isCompleted !== 'boolean') {
      return c.json({ error: 'Invalid input' }, 400);
    }

   
    const newReminder = new Reminder(body.id, body.title, body.dueDate, body.isCompleted);

  
    reminders.push(newReminder);
    return c.json(newReminder, 201);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return c.json({ error: 'Invalid request' }, 400);
  }
});


app.get('/reminders', (c) => {
  console.log('Fetching all reminders'); 
  return reminders.length ? c.json(reminders) : c.json({ error: 'No reminders found' }, 404);
});


app.get('/reminders/:id', (c) => {
  const id = c.req.param('id').toString();
  console.log(`Fetching reminder with id: ${id}`); 

  const reminder = reminders.find((r) => r.id === id);
  return reminder ? c.json(reminder) : c.json({ error: 'Reminder not found' }, 404);
});


app.patch('/reminders/:id', async (c) => {
  const id = c.req.param('id').toString();
  console.log(`Updating reminder with id: ${id}`); 

  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) return c.json({ error: 'Reminder not found' }, 404);

  try {
    const body = await c.req.json();
    console.log('Update payload:', body); 


    const reminder = reminders[index];
    if (body.title) reminder.title = body.title;
    if (body.dueDate) reminder.dueDate = body.dueDate;
    if (typeof body.isCompleted === 'boolean') reminder.isCompleted = body.isCompleted;

    return c.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error); 
    return c.json({ error: 'Invalid request' }, 400);
  }
});


app.delete('/reminders/:id', (c) => {
  const id = c.req.param('id').toString();
  console.log(`Deleting reminder with id: ${id}`); 
  const index = reminders.findIndex((r) => r.id === id);
  if (index === -1) return c.json({ error: 'Reminder not found' }, 404);


  reminders.splice(index, 1);
  return c.json({ message: 'Reminder deleted' });
});


app.post('/reminders/:id/mark-completed', (c) => {
  const id = c.req.param('id').toString();
  console.log(`Marking reminder with id: ${id} as completed`);

  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return c.json({ error: 'Reminder not found' }, 404);

  reminder.isCompleted = true;
  return c.json(reminder);
});


app.post('/reminders/:id/unmark-completed', (c) => {
  const id = c.req.param('id').toString();
  console.log(`Unmarking reminder with id: ${id} as completed`);

  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return c.json({ error: 'Reminder not found' }, 404);

  reminder.isCompleted = false;
  return c.json(reminder);
});


app.get('/reminders/completed', (c) => {
  console.log('Fetching completed reminders'); 
  const completed = reminders.filter((r) => r.isCompleted);
  console.log('Completed reminders:', completed);
  return completed.length ? c.json(completed) : c.json({ error: 'No completed reminders' }, 404);
});


app.get('/reminders/not-completed', (c) => {
  console.log('Fetching not completed reminders'); 
  const notCompleted = reminders.filter((r) => !r.isCompleted);
  console.log('Not completed reminders:', notCompleted); 
  return notCompleted.length ? c.json(notCompleted) : c.json({ error: 'No uncompleted reminders' }, 404);
});


app.get('/reminders/due-today', (c) => {
  console.log('Fetching reminders due today'); 
  const today = new Date().toISOString().split('T')[0];
  console.log('Today:', today); 
  const dueToday = reminders.filter((r) => r.dueDate.split('T')[0] === today);
  console.log('Reminders due today:', dueToday); 
  return dueToday.length ? c.json(dueToday) : c.json({ error: 'No reminders due today' }, 404);
});



serve({
  fetch: app.fetch,
  port: 3000,
});

console.log(' Server running at http://localhost:3000');