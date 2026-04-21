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
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight text-ink">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-sm text-white shadow-lg shadow-ink/20">
            D
          </span>
          <span>
            DONATO
            <span className="block text-[11px] font-medium tracking-[0.18em] text-ink/45">STREAMER PAYMENTS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 overflow-x-auto md:gap-3">
          <NavLink to="/" className={({ isActive }) => `button-secondary ${isActive ? 'border-ink bg-ink text-white' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/streamers" className={({ isActive }) => `button-secondary ${isActive ? 'border-ink bg-ink text-white' : ''}`}>
            Streamers
          </NavLink>
          {user && (
            <NavLink to="/dashboard/user" className={({ isActive }) => `button-secondary ${isActive ? 'border-ink bg-ink text-white' : ''}`}>
              Dashboard
            </NavLink>
          )}
          {user?.role === 'streamer' && (
            <NavLink to="/dashboard/streamer" className={({ isActive }) => `button-secondary ${isActive ? 'border-ink bg-ink text-white' : ''}`}>
              Streamer Live
            </NavLink>
          )}
          {!user ? (
            <>
              <NavLink to="/login" className={({ isActive }) => `button-secondary ${isActive ? 'border-ink bg-ink text-white' : ''}`}>
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
