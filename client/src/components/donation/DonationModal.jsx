import { useState } from 'react';
import { donate } from '../../services/donationService';

const methods = ['mock', 'esewa', 'khalti'];

function DonationModal({ streamer, isOpen, onClose, onDonationSuccess }) {
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mock');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const submitDonation = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const donation = await donate({
        streamerId: streamer.id,
        amount: Number(amount),
        message,
        paymentMethod
      });

      onDonationSuccess(donation);
      onClose();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
      <div className="card w-full max-w-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Donate to {streamer.displayName}</h2>
          <button type="button" onClick={onClose} className="button-secondary">
            Close
          </button>
        </div>

        <form onSubmit={submitDonation} className="space-y-3">
          <label className="block text-sm font-medium">
            Amount
            <input
              className="input mt-1"
              min="1"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium">
            Message
            <textarea
              className="input mt-1 min-h-24"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Send a supportive message"
            />
          </label>

          <label className="block text-sm font-medium">
            Payment Method
            <select
              className="input mt-1"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {methods.map((method) => (
                <option key={method} value={method}>
                  {method.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-ember">{error}</p>}

          <button disabled={submitting} type="submit" className="button-primary w-full">
            {submitting ? 'Processing...' : 'Confirm Donation'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationModal;
