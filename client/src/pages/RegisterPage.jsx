import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    displayName: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await register(form);
      navigate('/streamers');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
      <aside className="card overflow-hidden p-0">
        <div className="bg-[linear-gradient(135deg,#101827_0%,#1d3653_52%,#f39b17_180%)] px-6 py-7 text-white md:px-8">
          <span className="pill bg-white/12 text-white">Create your account</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">Join DONATO and start supporting streamers</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 md:text-base">
            Register with phone number or email. Choose a user account or streamer account during signup.
          </p>
        </div>

        <div className="space-y-4 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Phone support</p>
              <p className="mt-1 font-semibold">Phone and email auth</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Streamer mode</p>
              <p className="mt-1 font-semibold">Display name and bio</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Session</p>
              <p className="mt-1 font-semibold">Auto login after signup</p>
            </div>
            <div className="rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Product feel</p>
              <p className="mt-1 font-semibold">Built like a real app</p>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-4 text-sm leading-6 text-ink/70">
            Register once and use the same session to browse creators, donate, and open dashboards.
          </div>
        </div>
      </aside>

      <div className="card p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="pill bg-glow/20 text-ink">Create account</span>
            <h2 className="mt-4 font-display text-3xl font-bold">Make your account</h2>
          </div>
          <Link className="text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4" to="/login">
            Already have one?
          </Link>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium md:col-span-2">
            Full name
            <input className="input mt-1" name="name" value={form.name} onChange={onChange} required />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input
              className="input mt-1"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium">
            Phone number
            <input
              className="input mt-1"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="9800000000"
              inputMode="tel"
            />
          </label>

          <label className="block text-sm font-medium md:col-span-2">
            Password
            <input
              className="input mt-1"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>

          <label className="block text-sm font-medium md:col-span-2">
            Account type
            <select className="input mt-1" name="role" value={form.role} onChange={onChange}>
              <option value="user">User</option>
              <option value="streamer">Streamer</option>
            </select>
          </label>

          {form.role === 'streamer' && (
            <>
              <label className="block text-sm font-medium md:col-span-2">
                Streamer display name
                <input
                  className="input mt-1"
                  name="displayName"
                  value={form.displayName}
                  onChange={onChange}
                  placeholder="Your creator name"
                />
              </label>

              <label className="block text-sm font-medium md:col-span-2">
                Bio
                <textarea
                  className="input mt-1 min-h-28"
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  placeholder="Tell viewers what you stream"
                />
              </label>
            </>
          )}

          {error && <p className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm leading-6 text-ember md:col-span-2">{error}</p>}

          <button className="button-primary md:col-span-2" disabled={submitting} type="submit">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
