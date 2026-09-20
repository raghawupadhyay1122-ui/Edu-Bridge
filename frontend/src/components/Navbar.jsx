import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand-wrap">
        <div className="brand-mark">📚</div>
        <div className="navbar-brand">Doubt Portal</div>
      </div>
      {user && (
        <div className="navbar-user">
          <span>
            <strong>{user.name}</strong>
            <span className="badge">{user.role}</span>
          </span>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
