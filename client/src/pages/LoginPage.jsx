import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const { login, startGoogleAuth } = useAuth();
  const [mode, setMode] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const response = await authService.config();
        if (mounted) {
          setGoogleEnabled(Boolean(response.googleOAuthEnabled));
        }
      } catch (requestError) {
        if (mounted) {
          setGoogleEnabled(false);
        }
      } finally {
        if (mounted) {
          setGoogleLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

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
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
      <div className="card overflow-hidden p-0">
        <div className="bg-[linear-gradient(135deg,#101827_0%,#1d3653_52%,#f39b17_180%)] px-6 py-7 text-white md:px-8">
          <span className="pill bg-white/12 text-white">Secure login</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">Login to DONATO</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 md:text-base">
            Use Google sign-in if it is configured, or sign in with your phone number/email and password.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="pill bg-white/12 text-white">Phone login</span>
            <span className="pill bg-white/12 text-white">Email login</span>
            <span className="pill bg-white/12 text-white">Google OAuth</span>
          </div>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <button
            type="button"
            className="button-secondary w-full justify-center gap-2"
            onClick={() => {
              if (!googleEnabled) {
                setError('Google login is not configured on this server. Use phone or email login, or set the Google env vars in the backend.');
                return;
              }
              startGoogleAuth();
            }}
            disabled={googleLoading}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-glow text-[10px] font-bold text-ink">
              G
            </span>
            {googleLoading ? 'Checking Google sign-in...' : googleEnabled ? 'Continue with Google' : 'Google sign-in unavailable'}
          </button>

          {!googleEnabled && (
            <div className="rounded-2xl border border-ember/20 bg-ember/8 px-4 py-3 text-sm leading-6 text-ember">
              Google OAuth is not configured on the backend yet. Phone/email login still works.
            </div>
          )}

          <div className="grid grid-cols-2 rounded-2xl border border-ink/10 bg-paper p-1">
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'phone' ? 'bg-white shadow-sm' : 'text-ink/55'}`}
              onClick={() => setMode('phone')}
            >
              Phone
            </button>
            <button
              type="button"
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'email' ? 'bg-white shadow-sm' : 'text-ink/55'}`}
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

            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink/60">
              <span>Login takes a few seconds.</span>
              <span>Cookie-based session auth.</span>
            </div>

            {error && <p className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm leading-6 text-ember">{error}</p>}

            <button className="button-primary w-full" disabled={submitting} type="submit">
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-sm text-ink/70">
            New here?{' '}
            <Link className="font-semibold text-ink underline decoration-ink/30 underline-offset-4" to="/register">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <aside className="card overflow-hidden p-0">
        <div className="bg-white px-6 py-7 md:px-8">
          <span className="pill bg-glow/20 text-ink">Product experience</span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight">A cleaner, more real-looking creator app</h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            The UI now explains whether Google is configured and gives you a proper sign-in flow instead of a broken-looking button.
          </p>
        </div>

        <div className="space-y-4 border-t border-ink/10 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Fast auth</p>
              <p className="mt-1 font-semibold">Phone, email, and Google</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Session</p>
              <p className="mt-1 font-semibold">httpOnly cookie login</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Dashboards</p>
              <p className="mt-1 font-semibold">User and streamer views</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Payments</p>
              <p className="mt-1 font-semibold">Donation API backed</p>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-[linear-gradient(135deg,rgba(15,28,42,0.04),rgba(243,155,23,0.08))] p-4 text-sm leading-6 text-ink/70">
            If Google sign-in still says failed, it means the backend env vars are missing or the callback URL does not match the server.
          </div>
        </div>
      </aside>
    </section>
  );
}

export default LoginPage;
