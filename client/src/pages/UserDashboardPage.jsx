import { useEffect, useState } from 'react';
import { getSummary, getUserDonations } from '../services/donationService';

function UserDashboardPage() {
  const [summary, setSummary] = useState({ totalDonated: 0, totalReceived: 0 });
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [summaryData, donationData] = await Promise.all([getSummary(), getUserDonations()]);
        if (mounted) {
          setSummary(summaryData);
          setDonations(donationData);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || 'Failed to load dashboard');
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
  }, []);

  if (loading) {
    return <div className="card p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="card p-6 text-ember">{error}</div>;
  }

  return (
    <section className="space-y-4">
      <div className="card p-6">
        <span className="pill bg-glow/20 text-ink">Your activity</span>
        <h1 className="mt-3 font-display text-3xl font-bold">User dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
          See your donation history, track how much you’ve supported streamers, and review your recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm text-ink/70">Total Donated</p>
          <p className="font-display text-3xl font-bold">NPR {summary.totalDonated.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ink/70">Total Received (if streamer)</p>
          <p className="font-display text-3xl font-bold">NPR {summary.totalReceived.toFixed(2)}</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-display text-xl font-semibold">Donation History</h2>
        <div className="mt-3 space-y-2">
          {donations.length ? (
            donations.map((item) => (
              <div key={item.id} className="rounded-xl border border-ink/10 bg-white p-3">
                <p className="text-sm font-semibold">To: {item.streamerName}</p>
                <p className="text-sm">NPR {item.amount.toFixed(2)}</p>
                <p className="text-sm text-ink/70">{item.message || 'No message'}</p>
                <p className="text-xs text-ink/50">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No donations found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserDashboardPage;
