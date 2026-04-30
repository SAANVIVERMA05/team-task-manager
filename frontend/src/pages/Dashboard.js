import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    return dashboard?.statusStats?.find(s => s._id === status)?.count || 0;
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Analytics</h1>
        <p className="page-subtitle">Welcome back! Here's an overview of your tasks and team progress.</p>
      </div>

      {!dashboard?.statusStats && (
        <div className="alert alert-danger">
          <strong>Action Required:</strong> Please restart your backend server. The backend changes haven't been applied because <code>node server.js</code> doesn't auto-restart.
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-danger-light text-danger">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Overdue Tasks</h4>
            <p className="stat-value">{dashboard?.overdue || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-success-light text-success">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Completed</h4>
            <p className="stat-value">{getStatusCount("done")}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-primary-light text-primary">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h4>In Progress</h4>
            <p className="stat-value">{getStatusCount("in-progress")}</p>
          </div>
        </div>
      </div>

      {userRole === "admin" && dashboard?.userStats && (
        <div className="section-container mt-8">
          <div className="section-header">
            <h3>Team Performance</h3>
            <p>Task distribution among team members</p>
          </div>
          <div className="card-grid">
            {dashboard.userStats.map(u => (
              <div className="item-card" key={u.name}>
                <div className="item-header border-none pb-0">
                  <div className="user-badge">
                    <div className="user-avatar-small">{u.name.charAt(0)}</div>
                    <span className="font-semibold">{u.name}</span>
                  </div>
                  <span className="badge badge-neutral">{u.count} Tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
