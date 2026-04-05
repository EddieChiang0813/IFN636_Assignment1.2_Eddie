import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/home" style={styles.brand}>Eddie Forms</Link>

      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerButton}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#B3CDE0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  brand: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1f3b57',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  link: {
    color: '#1f3b57',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '10px',
  },
  registerButton: {
    backgroundColor: '#48B26D',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '10px',
  },
  logoutButton: {
    backgroundColor: '#B71111',
    color: '#fff',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default Navbar;
