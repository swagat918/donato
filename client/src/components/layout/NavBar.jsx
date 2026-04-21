import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/streamers" className="font-display text-lg font-bold tracking-tight text-ink">
          DONATO
        </Link>

        <nav className="flex items-center gap-2 md:gap-4">
          <NavLink to="/streamers" className="button-secondary">
            Streamers
          </NavLink>
          {user && (
            <NavLink to="/dashboard/user" className="button-secondary">
              Dashboard
            </NavLink>
          )}
          {user?.role === 'streamer' && (
            <NavLink to="/dashboard/streamer" className="button-secondary">
              Streamer Live
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" className="button-secondary">
                Login
              </NavLink>
              <NavLink to="/register" className="button-primary">
                Register
              </NavLink>
            </>
          ) : (
            <button type="button" onClick={onLogout} className="button-primary">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
