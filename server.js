const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
  
//Middleware used= 
app.use(bodyParser.json());
  
// Database setup=
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to SQLite database');
      createTable();
    }
});
  
function createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending'
      )
    `;
    db.run(query, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Tasks table created successfully');
      }
    });
}
  
//Create a new task
  app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
  
    const query = `
      INSERT INTO tasks (title, description)
      VALUES (?, ?)
    `;
    
    db.run(query, [title, description], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating task' });
      }
      
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        status: 'pending'
      });
    });
  });
  
// Get all tasks
app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM tasks';
    
    db.all(query, [], (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching tasks' });
      }
      res.json(tasks);
    });
});
  
// Get a task by ID
app.get('/tasks/:id', (req, res) => {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    
    db.get(query, [req.params.id], (err, task) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching task' });
      }
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    });
});
  
// Update task status
app.put('/tasks/:id', (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'completed'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, in-progress, completed' 
      });
    }
  
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
    
    db.run(query, [status, req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating task' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task updated successfully' });
    });
});
  
// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(query, [req.params.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error deleting task' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully' });
    });
});
  
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});