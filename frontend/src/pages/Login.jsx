import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('student123');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login({ username, password, role });
    if (ok) {
      navigate(role === 'student' ? '/student' : '/faculty');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="role-toggle">
          <button
            type="button"
            className={role === 'student' ? 'active' : ''}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={role === 'faculty' ? 'active' : ''}
            onClick={() => setRole('faculty')}
          >
            Faculty
          </button>
        </div>

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="student or faculty"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <p className="demo-text">
          Demo accounts: student / student123 and faculty / faculty123
        </p>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : `Login as ${role}`}
        </button>

        <p className="switch-auth">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
