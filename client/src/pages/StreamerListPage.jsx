import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStreamers } from '../services/streamerService';

function StreamerListPage() {
  const [streamers, setStreamers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

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

  const filteredStreamers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return streamers;
    return streamers.filter((streamer) => {
      const haystack = `${streamer.displayName} ${streamer.bio || ''}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [query, streamers]);

  if (loading) {
    return <div className="card p-6">Loading streamers...</div>;
  }

  if (error) {
    return <div className="card p-6 text-ember">{error}</div>;
  }

  return (
    <section className="space-y-5">
      <div className="card p-6">
        <span className="pill bg-mint/20 text-mint">Browse streamers</span>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-5xl">Discover creators on DONATO</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 md:text-base">
              Find streamers, open their profile, and donate with a message. This page is designed like a real platform catalog.
            </p>
          </div>
          <label className="block text-sm font-medium">
            Search streamers
            <input
              className="input mt-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or bio"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredStreamers.map((streamer) => (
          <article key={streamer.id} className="card overflow-hidden p-0">
            <div className="h-28 bg-[linear-gradient(135deg,#101827_0%,#2f496b_100%)]" />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">{streamer.displayName}</h2>
                  <p className="mt-1 text-sm text-ink/65">{streamer.bio || 'No bio added yet.'}</p>
                </div>
                <span className="pill bg-glow/20 text-ink">Live</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-paper p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Total earnings</p>
                  <p className="mt-1 font-display text-lg font-bold">NPR {streamer.totalEarnings.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl bg-paper p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Status</p>
                  <p className="mt-1 font-display text-lg font-bold">Ready</p>
                </div>
              </div>

              <Link to={`/streamers/${streamer.id}`} className="button-primary w-full">
                View profile & donate
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!filteredStreamers.length && (
        <div className="card p-6 text-center text-sm text-ink/65">
          No streamers match your search.
        </div>
      )}
    </section>
  );
}

export default StreamerListPage;
