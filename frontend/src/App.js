import { useState, useEffect } from 'react';
import './App.css';

const API = 'http://localhost:4000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const fetchTasks = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTasks();
  };

  const updateTask = async (id) => {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editingTitle }),
    });
    setEditingId(null);
    setEditingTitle('');
    fetchTasks();
  };

  const deleteTask = async (task) => {
    await fetch(`${API}/${task._id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>

        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              {editingId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                  <button onClick={() => updateTask(task._id)}>💾 Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => deleteTask(task)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
