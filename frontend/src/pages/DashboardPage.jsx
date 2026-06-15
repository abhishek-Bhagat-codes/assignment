import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskApi } from '../api/client';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await taskApi.getAll();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, loadTasks]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const data = await taskApi.create(payload);
      setTasks((prev) => [data.task, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setError('');
    const data = await taskApi.update(id, payload);
    setTasks((prev) => prev.map((task) => (task._id === id ? data.task : task)));
  };

  const handleDelete = async (id) => {
    setError('');
    await taskApi.delete(id);
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="container page">
        <div className="card hero-card">
          <h1>Organize your work</h1>
          <p>Create, track, and complete tasks in one simple place.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/signup" className="btn btn-ghost">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage your tasks and stay on track.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="dashboard-layout">
        <TaskForm onSubmit={handleCreate} loading={submitting} />

        <section className="tasks-section">
          <h2>Your Tasks ({tasks.length})</h2>
          {loading ? (
            <div className="card empty-state">
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
          )}
        </section>
      </div>
    </div>
  );
}
