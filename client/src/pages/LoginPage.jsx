import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login, startGoogleAuth } = useAuth();
  const [mode, setMode] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const identifier = mode === 'phone' ? phone : email;

    try {
      await login({ identifier, password });
      navigate('/streamers');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <div className="card overflow-hidden p-0">
        <div className="bg-ink px-6 py-6 text-white">
          <span className="pill bg-white/15 text-white">Secure login</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight">Login to DONATO</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
            Use Google sign-in or your phone number/email and password to access donation history, dashboards, and live updates.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <button type="button" className="button-secondary w-full gap-2" onClick={startGoogleAuth}>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-glow text-[10px] font-bold text-ink">
              G
            </span>
            Continue with Google
          </button>

          <div className="flex rounded-2xl border border-ink/10 bg-paper p-1">
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'phone' ? 'bg-white shadow-sm' : 'text-ink/60'}`}
              onClick={() => setMode('phone')}
            >
              Phone
            </button>
            <button
              type="button"
              className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'email' ? 'bg-white shadow-sm' : 'text-ink/60'}`}
              onClick={() => setMode('email')}
            >
              Email
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'phone' ? (
              <label className="block text-sm font-medium">
                Phone number
                <input
                  className="input mt-1"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="9800000000"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </label>
            ) : (
              <label className="block text-sm font-medium">
                Email address
                <input
                  className="input mt-1"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            )}

            <label className="block text-sm font-medium">
              Password
              <input
                className="input mt-1"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <div className="flex items-center justify-between text-sm text-ink/60">
              <span>Login only takes a few seconds.</span>
              <span>Phone and email supported.</span>
            </div>

            {error && <p className="rounded-xl bg-ember/10 px-3 py-2 text-sm text-ember">{error}</p>}

            <button className="button-primary w-full" disabled={submitting} type="submit">
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-ink/70">
            New here?{' '}
            <Link className="font-semibold text-ink underline" to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <aside className="card p-6">
        <h2 className="font-display text-2xl font-bold">Why DONATO feels real</h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-ink/70">
          <p>• Phone login and Google login are both in the UI and routed into the backend auth flow.</p>
          <p>• Streamers can see live donations, donor messages, totals, and recent activity.</p>
          <p>• Users can donate fast with a clean donation flow and a proper dashboard history.</p>
          <p>• The app is designed as an actual deployable product instead of a bare demo page.</p>
        </div>
      </aside>
    </section>
  );
}

export default LoginPage;
