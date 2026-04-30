import { useState, useEffect } from 'react';
import { Plus, Users, FolderOpen } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
  
  const { userRole } = useAuth();

  useEffect(() => {
    fetchProjects();
    if (userRole === 'admin') fetchUsers();
  }, [userRole]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  const handleMemberSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setNewProject({ ...newProject, members: selected });
  };

  if (loading) return <div className="loading-state">Loading projects...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage your team projects and collaborations</p>
        </div>
        {userRole === 'admin' && (
          <button className="btn btn-primary flex-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="card-grid">
        {projects.map(p => (
          <div className="item-card project-card" key={p._id}>
            <div className="item-header">
              <div className="item-title flex-center gap-2">
                <FolderOpen size={18} className="text-primary" />
                {p.name}
              </div>
            </div>
            <div className="item-body">
              <p>{p.description || "No description provided."}</p>
            </div>
            <div className="item-footer">
              <div className="flex-center gap-1 text-muted">
                <Users size={16} />
                <span>{p.members.length} Members</span>
              </div>
              {userRole === 'admin' && <button className="btn-text">Manage</button>}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <FolderOpen size={48} className="text-muted opacity-50 mb-4" />
          <h3>No projects found</h3>
          <p className="text-muted">You haven't been assigned to any projects yet.</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Project Name</label>
                <input className="form-input" placeholder="e.g. Website Redesign" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" placeholder="Briefly describe the project..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Assign Members <span className="text-muted font-normal">(Hold Ctrl/Cmd to select multiple)</span></label>
                <select multiple className="form-input" onChange={handleMemberSelection} style={{height: '120px'}}>
                  {allUsers.map(u => (
                    <option key={u._id} value={u._id} className="p-2 border-b border-gray-100">{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
