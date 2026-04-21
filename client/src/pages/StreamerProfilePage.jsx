import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DonationModal from '../components/donation/DonationModal';
import { getStreamer } from '../services/streamerService';
import { useAuth } from '../hooks/useAuth';

function StreamerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [streamer, setStreamer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await getStreamer(id);
        if (mounted) {
          setStreamer(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || 'Could not load streamer');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div className="card p-6">Loading streamer profile...</div>;
  }

  if (error) {
    return <div className="card p-6 text-ember">{error}</div>;
  }

  if (!streamer) {
    return <div className="card p-6">Streamer not found.</div>;
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card overflow-hidden p-0">
          <div className="h-44 bg-[linear-gradient(135deg,#101827_0%,#2f496b_45%,#f39b17_130%)]" />
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="pill bg-glow/20 text-ink">Streamer Profile</span>
                <h1 className="mt-3 font-display text-4xl font-bold">{streamer.displayName}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{streamer.bio || 'No bio added.'}</p>
              </div>

              <div className="rounded-3xl bg-paper px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Live total</p>
                <p className="mt-1 font-display text-3xl font-bold">NPR {streamer.totalEarnings.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Donations live</p>
                <p className="mt-1 font-display text-2xl font-bold">{streamer.recentDonations?.length || 0}</p>
              </div>
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Support ready</p>
                <p className="mt-1 font-display text-2xl font-bold">Yes</p>
              </div>
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Commission</p>
                <p className="mt-1 font-display text-2xl font-bold">5%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary"
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  setModalOpen(true);
                }}
              >
                Donate now
              </button>
              <button type="button" className="button-secondary" onClick={() => navigate('/streamers')}>
                Back to streamers
              </button>
            </div>
          </div>
        </div>

        <aside className="card p-6">
          <h2 className="font-display text-2xl font-bold">Support this creator</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Donations show the donor message, update totals instantly, and appear in the live feed on the streamer dashboard.
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Donation flow</p>
              <p className="mt-1 font-semibold">Amount + message + payment method</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Payment methods</p>
              <p className="mt-1 font-semibold">Mock, eSewa, Khalti</p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Audience</p>
              <p className="mt-1 font-semibold">Logged-in users and supporters</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold">Recent donations</h2>
        <div className="mt-4 space-y-3">
          {streamer.recentDonations?.length ? (
            streamer.recentDonations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-ink/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.donorName}</p>
                    <p className="text-sm text-ink/70">{item.message || 'No message'}</p>
                  </div>
                  <span className="pill bg-mint/20 text-mint">NPR {item.amount.toFixed(2)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No donations yet.</p>
          )}
        </div>
      </div>

      <DonationModal
        streamer={streamer}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDonationSuccess={() => {
          getStreamer(id).then(setStreamer).catch(() => null);
        }}
      />
    </section>
  );
}

export default StreamerProfilePage;
