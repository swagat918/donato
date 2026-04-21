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
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
      <aside className="card p-6">
        <span className="pill bg-mint/20 text-mint">Create your account</span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight">Join DONATO and start supporting streamers</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Register with phone number or email. Choose a user account or streamer account during signup.
        </p>

        <div className="mt-6 space-y-4 rounded-3xl bg-paper p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Phone number support</p>
            <p className="mt-1 font-semibold">Make this feel like a real app.</p>
          </div>
          <p className="text-sm text-ink/70">
            The form supports phone number, email, password, Google login later, and streamer profile fields right here.
          </p>
        </div>
      </aside>

      <div className="card p-6">
        <h2 className="font-display text-2xl font-bold">Create your account</h2>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
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

          {error && <p className="rounded-xl bg-ember/10 px-3 py-2 text-sm text-ember md:col-span-2">{error}</p>}

          <button className="button-primary md:col-span-2" disabled={submitting} type="submit">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-sm text-ink/70">
          Already have an account?{' '}
          <Link className="font-semibold text-ink underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
