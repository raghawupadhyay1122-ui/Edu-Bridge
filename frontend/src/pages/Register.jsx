import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    subject: '',
    rollNumber: '',
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await register({ ...form, role });
    if (ok) {
      navigate(role === 'student' ? '/student' : '/faculty');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

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

        <label>Full Name</label>
        <input value={form.name} onChange={update('name')} required placeholder="Jane Doe" />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={6}
          placeholder="At least 6 characters"
        />

        {role === 'student' ? (
          <>
            <label>Roll Number (optional)</label>
            <input value={form.rollNumber} onChange={update('rollNumber')} placeholder="e.g. CS21B045" />
          </>
        ) : (
          <>
            <label>Subject / Department (optional)</label>
            <input value={form.subject} onChange={update('subject')} placeholder="e.g. Data Structures" />
          </>
        )}

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : `Register as ${role}`}
        </button>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
