import { useState, useEffect } from 'react';
import { Plus, Calendar, CheckSquare } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', project: '', assignedTo: '', priority: 'medium', dueDate: '' });
  
  const { userRole } = useAuth();

  useEffect(() => {
    fetchTasks();
    if (userRole === 'admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [userRole]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', project: '', assignedTo: '', priority: 'medium', dueDate: '' });
      fetchTasks();
    } catch (err) { alert("Error creating task"); }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-state">Loading tasks...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Track and manage your assigned responsibilities</p>
        </div>
        {userRole === 'admin' && (
          <button className="btn btn-primary flex-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Assign Task
          </button>
        )}
      </div>

      <div className="task-list">
        {tasks.map(t => (
          <div className="task-row" key={t._id}>
            <div className="task-content">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="task-title">{t.title}</h4>
                <span className={`badge badge-${t.priority}`}>{t.priority}</span>
              </div>
              <div className="task-meta">
                <span><strong>Project:</strong> {t.project?.name || 'Unassigned'}</span>
                <span className="divider">•</span>
                <span><strong>Assignee:</strong> {t.assignedTo?.name || 'Unassigned'}</span>
                <span className="divider">•</span>
                <span className="flex-center gap-1">
                  <Calendar size={14} /> 
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'No date'}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <select 
                className={`status-select status-${t.status}`}
                value={t.status} 
                onChange={(e) => updateTaskStatus(t._id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <CheckSquare size={48} className="text-muted opacity-50 mb-4" />
          <h3>All caught up!</h3>
          <p className="text-muted">You have no pending tasks assigned to you.</p>
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h2>Assign New Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Task Title</label>
                <input className="form-input" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Project</label>
                  <select className="form-input" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} required>
                    <option value="">Select a project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Assign To</label>
                  <select className="form-input" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} required>
                    <option value="">Select team member</option>
                    {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Priority</label>
                  <select className="form-input" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Due Date</label>
                  <input className="form-input" type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
