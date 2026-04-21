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
    <section className="mx-auto max-w-xl">
      <div className="card p-6">
        <h1 className="font-display text-2xl font-bold">Create DONATO Account</h1>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium md:col-span-2">
            Name
            <input className="input mt-1" name="name" value={form.name} onChange={onChange} />
          </label>

          <label className="block text-sm font-medium">
            Email
            <input className="input mt-1" name="email" value={form.email} onChange={onChange} />
          </label>

          <label className="block text-sm font-medium">
            Phone
            <input className="input mt-1" name="phone" value={form.phone} onChange={onChange} />
          </label>

          <label className="block text-sm font-medium md:col-span-2">
            Password
            <input
              className="input mt-1"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
            />
          </label>

          <label className="block text-sm font-medium md:col-span-2">
            Role
            <select className="input mt-1" name="role" value={form.role} onChange={onChange}>
              <option value="user">User</option>
              <option value="streamer">Streamer</option>
            </select>
          </label>

          {form.role === 'streamer' && (
            <>
              <label className="block text-sm font-medium md:col-span-2">
                Streamer Display Name
                <input
                  className="input mt-1"
                  name="displayName"
                  value={form.displayName}
                  onChange={onChange}
                />
              </label>

              <label className="block text-sm font-medium md:col-span-2">
                Bio
                <textarea className="input mt-1 min-h-24" name="bio" value={form.bio} onChange={onChange} />
              </label>
            </>
          )}

          {error && <p className="text-sm text-ember md:col-span-2">{error}</p>}

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
