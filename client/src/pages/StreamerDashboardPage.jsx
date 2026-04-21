import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStreamerDonations, getSummary } from '../services/donationService';
import { connectSocket, joinStreamerRoom, leaveStreamerRoom, onNewDonation } from '../services/socket';

function StreamerDashboardPage() {
  const { streamer } = useAuth();
  const [summary, setSummary] = useState({ totalDonated: 0, totalReceived: 0 });
  const [donations, setDonations] = useState([]);
  const [status, setStatus] = useState('connecting');
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

    const socket = connectSocket();

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
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Streamer Dashboard</h1>
          <span className={`pill ${statusClass}`}>Socket: {status}</span>
        </div>
        <p className="mt-3 text-sm text-ink/70">Total Earnings</p>
        <p className="font-display text-4xl font-bold">NPR {summary.totalReceived.toFixed(2)}</p>
      </div>

      <div className="card p-5">
        <h2 className="font-display text-xl font-semibold">Live Donation Feed</h2>
        <div className="mt-3 space-y-2">
          {donations.length ? (
            donations.map((item) => (
              <div key={item.id} className="rounded-xl border border-ink/10 bg-white p-3">
                <p className="text-sm font-semibold">{item.donorName} donated NPR {item.amount.toFixed(2)}</p>
                <p className="text-sm text-ink/70">{item.message || 'No message'}</p>
                <p className="text-xs text-ink/50">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink/70">No donations received yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default StreamerDashboardPage;
