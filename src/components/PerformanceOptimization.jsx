import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sanitizeInput } from '../utils/sanitize.js';
import { trackEvent } from '../utils/analytics.js';
import './PerformanceOptimization.css';

const SAMPLE_TASKS = [
  { id: '1', title: 'Compress hero images', status: 'pending' },
  { id: '2', title: 'Enable lazy loading', status: 'in-progress' },
  { id: '3', title: 'Audit third-party scripts', status: 'done' },
];

let idCounter = 100;

export default function PerformanceOptimization() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);

  // Simulated async initial fetch — shows loading indicator
  useEffect(() => {
    mountedRef.current = true;
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setTasks(SAMPLE_TASKS);
        setLoading(false);
      }
    }, 600);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, searchTerm]);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTitleChange = useCallback(
    (e) => {
      setFormTitle(e.target.value);
      if (formError) setFormError('');
    },
    [formError]
  );

  const handleAddTask = useCallback(
    (e) => {
      e.preventDefault();
      if (submitting) return;

      const sanitized = sanitizeInput(formTitle);
      if (!sanitized) {
        setFormError('Task title is required.');
        return;
      }
      if (sanitized.length < 3) {
        setFormError('Task title must be at least 3 characters.');
        return;
      }

      setSubmitting(true);
      setTimeout(() => {
        setTasks((prev) => [
          ...prev,
          { id: String(++idCounter), title: sanitized, status: 'pending' },
        ]);
        setFormTitle('');
        setFormError('');
        setSubmitting(false);
        trackEvent();
      }, 300);
    },
    [formTitle, submitting]
  );

  const toggleStatus = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t
      )
    );
    trackEvent();
  }, []);

  if (loading) {
    return (
      <main className="po-container">
        <div className="po-loading" role="status">
          <span className="po-spinner" aria-hidden="true" />
          <span>Loading performance tasks…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="po-container">
      <header className="po-header">
        <h1 className="po-title">Performance Optimization</h1>
        <p className="po-subtitle">
          Track optimization tasks for the News Blog. {completedCount} of{' '}
          {tasks.length} complete.
        </p>
      </header>

      <form className="po-form" onSubmit={handleAddTask} noValidate>
        <label htmlFor="task-title" className="po-label">
          New task title
        </label>
        <div className="po-form-row">
          <input
            id="task-title"
            type="text"
            className={`po-input ${formError ? 'po-input-error' : ''}`}
            value={formTitle}
            onChange={handleTitleChange}
            aria-invalid={formError ? 'true' : 'false'}
            aria-describedby={formError ? 'task-title-error' : undefined}
            placeholder="e.g., Minify CSS bundle"
            disabled={submitting}
          />
          <button
            type="submit"
            className="po-button"
            disabled={submitting}
            aria-busy={submitting ? 'true' : 'false'}
          >
            {submitting ? 'Adding…' : 'Add task'}
          </button>
        </div>
        {formError && (
          <p id="task-title-error" className="po-error" role="alert">
            {formError}
          </p>
        )}
      </form>

      <div className="po-search-wrap">
        <label htmlFor="task-search" className="po-label">
          Search tasks
        </label>
        <input
          id="task-search"
          type="search"
          className="po-input"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Filter by title…"
        />
      </div>

      <section aria-labelledby="task-list-heading">
        <h2 id="task-list-heading" className="po-sr-only">
          Task list
        </h2>
        {filteredTasks.length === 0 ? (
          <p className="po-empty" role="status">
            No data found
          </p>
        ) : (
          <ul className="po-list" aria-label="Performance tasks">
            {filteredTasks.map((task) => (
              <li key={task.id} className="po-list-item">
                <span className={`po-badge po-badge-${task.status}`}>
                  {task.status}
                </span>
                <span className="po-list-title">{task.title}</span>
                <button
                  type="button"
                  className="po-button po-button-ghost"
                  onClick={() => toggleStatus(task.id)}
                  aria-label={`Mark ${task.title} as ${
                    task.status === 'done' ? 'pending' : 'done'
                  }`}
                >
                  {task.status === 'done' ? 'Reopen' : 'Complete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}