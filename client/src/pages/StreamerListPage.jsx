import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStreamers } from '../services/streamerService';

function StreamerListPage() {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const items = await getStreamers();
        if (mounted) {
          setStreamers(items);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || 'Could not load streamers');
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
    return <div className="card p-6">Loading streamers...</div>;
  }

  if (error) {
    return <div className="card p-6 text-ember">{error}</div>;
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="font-display text-3xl font-bold">Discover Streamers</h1>
        <p className="text-sm text-ink/70">Support creators with meaningful messages and instant impact.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streamers.map((streamer) => (
          <article key={streamer.id} className="card p-5">
            <p className="pill bg-mint/20 text-mint">Live-ready</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{streamer.displayName}</h2>
            <p className="mt-1 text-sm text-ink/70">{streamer.bio || 'No bio added yet.'}</p>
            <p className="mt-3 text-sm font-medium">Total Earnings: NPR {streamer.totalEarnings.toFixed(2)}</p>
            <Link to={`/streamers/${streamer.id}`} className="button-primary mt-4 w-full">
              View and Donate
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StreamerListPage;
