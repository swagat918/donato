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
    <section className="space-y-4">
      <div className="card p-6">
        <p className="pill bg-glow/20 text-ink">Streamer Profile</p>
        <h1 className="mt-2 font-display text-3xl font-bold">{streamer.displayName}</h1>
        <p className="mt-2 text-ink/70">{streamer.bio || 'No bio added.'}</p>
        <p className="mt-4 text-sm font-medium">Total Earnings: NPR {streamer.totalEarnings.toFixed(2)}</p>

        <div className="mt-5 flex gap-3">
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
            Donate Now
          </button>
          <button type="button" className="button-secondary" onClick={() => navigate('/streamers')}>
            Back
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold">Recent Donations</h2>
        <div className="mt-3 space-y-3">
          {streamer.recentDonations?.length ? (
            streamer.recentDonations.map((item) => (
              <div key={item.id} className="rounded-xl border border-ink/10 bg-white p-3">
                <p className="text-sm font-semibold">{item.donorName}</p>
                <p className="text-sm">NPR {item.amount.toFixed(2)}</p>
                <p className="text-sm text-ink/70">{item.message || 'No message'}</p>
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
