import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { userRole, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <CheckSquare size={20} strokeWidth={2.5} color="white" />
        </div>
        <span>TaskPro</span>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FolderKanban size={18} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={18} />
          <span>My Tasks</span>
        </NavLink>
      </nav>

      <div className="user-profile">
        <div className="avatar">{userRole ? userRole.charAt(0).toUpperCase() : 'U'}</div>
        <div className="user-info">
          <div className="user-name">My Account</div>
          <div className="user-role">{userRole}</div>
        </div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
