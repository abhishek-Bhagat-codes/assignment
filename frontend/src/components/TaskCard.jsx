import { useState } from 'react';

const statusOptions = ['pending', 'in-progress', 'completed'];
const priorityOptions = ['low', 'medium', 'high'];

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(task._id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      await onDelete(task._id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className={`card task-card priority-${task.priority}`}>
      {editing ? (
        <div className="task-edit">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
          />
          <div className="form-row">
            <select name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select name="priority" value={form.priority} onChange={handleChange}>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="task-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h3>{task.title}</h3>
            <span className={`badge status-${task.status}`}>{task.status}</span>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <span className={`badge priority-${task.priority}`}>{task.priority}</span>
            {task.dueDate && (
              <span className="due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="task-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}
