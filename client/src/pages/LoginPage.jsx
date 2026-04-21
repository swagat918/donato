import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const { login, startGoogleAuth } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

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
    <section className="mx-auto max-w-md">
      <div className="card p-6">
        <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
        <p className="mt-1 text-sm text-ink/70">Login with Google or phone/email and password.</p>

        <button type="button" className="button-secondary mt-4 w-full" onClick={startGoogleAuth}>
          Continue with Google
        </button>

        <div className="my-4 border-t border-ink/10" />

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm font-medium">
            Phone or Email
            <input
              className="input mt-1"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="9800000000 or you@example.com"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              className="input mt-1"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="text-sm text-ember">{error}</p>}

          <button className="button-primary w-full" disabled={submitting} type="submit">
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-ink/70">
          New here?{' '}
          <Link className="font-semibold text-ink underline" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
