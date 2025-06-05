import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks when the app loads
  useEffect(() => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Handle form submission to create or update a task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      // Update task
      axios.put(`http://localhost:8080/api/tasks/${editingTask.id}`, {
        title,
        description,
        completed: editingTask.completed
      })
        .then(response => {
          setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
          resetForm();
        })
        .catch(error => console.error('Error updating task:', error));
    } else {
      // Create task
      axios.post('http://localhost:8080/api/tasks', {
        title,
        description,
        completed: false
      })
        .then(response => {
          setTasks([...tasks, response.data]);
          resetForm();
        })
        .catch(error => console.error('Error creating task:', error));
    }
  };

  // Delete a task
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  // Start editing a task
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingTask(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Form for adding/updating tasks */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-2 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Task list */}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-2 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
                      ...task,
                      completed: !task.completed
                    })
                      .then(response => {
                        setTasks(tasks.map(t => t.id === task.id ? response.data : t));
                      })
                      .catch(error => console.error('Error updating task:', error));
                  }}
                  className="mr-2"
                />
                <span>{task.completed ? 'Completed' : 'Pending'}</span>
              </label>
            </div>
            <div>
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;