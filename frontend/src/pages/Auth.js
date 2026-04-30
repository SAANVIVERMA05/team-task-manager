import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
        setIsLogin(true);
        setFormData({ ...formData, password: '' });
        alert('Account created successfully. Please sign in.');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
          <p>{isLogin ? 'Enter your details to sign in to your account' : 'Enter your details to get started'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-input" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
          )}
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-input" placeholder="name@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Role</label>
              <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="member">Team Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
