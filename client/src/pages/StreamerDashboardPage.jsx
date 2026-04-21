import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStreamerDonations, getSummary } from '../services/donationService';
import { connectSocket, joinStreamerRoom, leaveStreamerRoom, onNewDonation } from '../services/socket';

function StreamerDashboardPage() {
  const { streamer } = useAuth();
  const [summary, setSummary] = useState({ totalDonated: 0, totalReceived: 0 });
  const [donations, setDonations] = useState([]);
  const [status, setStatus] = useState('polling');
  const [error, setError] = useState('');

  const streamerId = streamer?.id;

  useEffect(() => {
    if (!streamerId) return;

    let mounted = true;

    async function load() {
      try {
        const [summaryData, streamerDonations] = await Promise.all([
          getSummary(),
          getStreamerDonations(streamerId)
        ]);
        if (mounted) {
          setSummary(summaryData);
          setDonations(streamerDonations);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError?.response?.data?.message || 'Failed to load streamer dashboard');
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [streamerId]);

  useEffect(() => {
    if (!streamerId) return;

    const poll = async () => {
      try {
        const [summaryData, streamerDonations] = await Promise.all([
          getSummary(),
          getStreamerDonations(streamerId)
        ]);
        setSummary(summaryData);
        setDonations(streamerDonations);
        setError('');
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Failed to sync streamer dashboard');
      }
    };

    const intervalId = setInterval(poll, 7000);

    return () => {
      clearInterval(intervalId);
    };
  }, [streamerId]);

  useEffect(() => {
    if (!streamerId) return;

    const socket = connectSocket();
    if (!socket) {
      setStatus('polling');
      return;
    }

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));

    joinStreamerRoom(streamerId);

    const unsubscribe = onNewDonation((event) => {
      if (event.streamerId !== streamerId) return;
      setSummary((current) => ({ ...current, totalReceived: event.totalEarnings }));
      setDonations((current) => [
        {
          id: event.donationId,
          donorName: event.donorName,
          amount: event.amount,
          message: event.message,
          paymentMethod: 'live',
          createdAt: event.timestamp
        },
        ...current
      ]);
    });

    return () => {
      unsubscribe();
      socket.off('connect');
      socket.off('disconnect');
      leaveStreamerRoom(streamerId);
    };
  }, [streamerId]);

  const statusClass = useMemo(() => {
    if (status === 'connected') return 'bg-mint/20 text-mint';
    if (status === 'disconnected') return 'bg-ember/20 text-ember';
    if (status === 'polling') return 'bg-glow/20 text-ink';
    return 'bg-glow/20 text-ink';
  }, [status]);

  if (!streamerId) {
    return <div className="card p-6">Streamer profile missing for this account.</div>;
  }

  if (error) {
    return <div className="card p-6 text-ember">{error}</div>;
  }

  return (
    <section className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="pill bg-mint/20 text-mint">Creator dashboard</span>
            <h1 className="mt-3 font-display text-3xl font-bold">Streamer dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              View live donations, donor messages, and the revenue you’ve earned from supporters in one place.
            </p>
          </div>
          <span className={`pill ${statusClass}`}>Sync: {status}</span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Total earnings</p>
            <p className="mt-1 font-display text-3xl font-bold">NPR {summary.totalReceived.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Current feed items</p>
            <p className="mt-1 font-display text-3xl font-bold">{donations.length}</p>
          </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Realtime mode</p>
            <p className="mt-1 font-display text-3xl font-bold">{status}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold">Live Donation Feed</h2>
        <div className="mt-4 space-y-3">
          {donations.length ? (
            donations.map((item) => (
              <div key={item.id} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.donorName} donated</p>
                    <p className="text-sm text-ink/70">{item.message || 'No message'}</p>
                  </div>
                  <span className="pill bg-glow/20 text-ink">NPR {item.amount.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-xs text-ink/50">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No donations received yet. Once donations arrive, they will appear here instantly.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default StreamerDashboardPage;
