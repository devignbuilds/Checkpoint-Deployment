import { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task', error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (error) {
      console.error('Error toggling task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Organize your work with elegance</p>
      </header>

      <main className="main-content">
        <form onSubmit={addTask} className="task-form glass-panel">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-title"
            required
          />
          <input
            type="text"
            placeholder="Add details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-desc"
          />
          <button type="submit" className="btn-add">Add Task</button>
        </form>

        <div className="tasks-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state glass-panel">
              <p>No tasks yet. Enjoy your free time!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className={`task-card glass-panel ${task.completed ? 'completed' : ''}`}>
                <div className="task-info">
                  <h3 onClick={() => toggleTask(task._id, task.completed)} className="task-title">
                     <span className="checkbox">{task.completed ? '✓' : ''}</span>
                     {task.title}
                  </h3>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </div>
                <button onClick={() => deleteTask(task._id)} className="btn-delete">×</button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
