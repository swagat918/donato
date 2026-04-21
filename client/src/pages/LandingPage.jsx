import { Link } from 'react-router-dom';

const highlights = [
  { label: 'Streamers live', value: '24/7' },
  { label: 'Instant donation feed', value: 'Real-time' },
  { label: 'Payment options', value: 'Mock + Gateway Ready' }
];

const features = [
  {
    title: 'Donate with phone or email login',
    text: 'People can sign in with a phone number or email, then donate in seconds.'
  },
  {
    title: 'Streamer dashboard with live feed',
    text: 'See new donations, donor messages, totals, and commission in one place.'
  },
  {
    title: 'Built for Vercel deployment',
    text: 'The repo is set up for real deployment with API routes, frontend build, and same-domain defaults.'
  }
];

function LandingPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <span className="pill bg-glow/20 text-ink">DONATO streamer donations</span>
          <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight md:text-6xl">
            Real donation website for creators, not a demo toy.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink/70 md:text-lg">
            Browse streamers, sign in with Google or phone number, donate with a message, and watch totals update live.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="button-primary">
              Create account
            </Link>
            <Link to="/login" className="button-secondary">
              Login
            </Link>
            <Link to="/streamers" className="button-secondary">
              Browse streamers
            </Link>
          </div>

          <div className="grid gap-3 pt-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="card p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{item.label}</p>
                <p className="mt-1 font-display text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="border-b border-ink/10 bg-ink px-5 py-4 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">Live stream preview</p>
            <p className="mt-1 text-2xl font-bold">SujanPlays</p>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/50">Total earnings</p>
                <p className="mt-1 font-display text-2xl font-bold">NPR 28,450</p>
              </div>
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/50">New donations</p>
                <p className="mt-1 font-display text-2xl font-bold">12 live</p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-ink/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Aarya Donor</p>
                <span className="pill bg-mint/20 text-mint">NPR 500</span>
              </div>
              <p className="text-sm text-ink/70">Keep going, this stream is awesome.</p>
            </div>

            <div className="space-y-3 rounded-2xl border border-ink/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Mina Donor</p>
                <span className="pill bg-glow/20 text-ink">NPR 1,000</span>
              </div>
              <p className="text-sm text-ink/70">Love the energy, here’s a boost.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="card p-5">
            <h2 className="font-display text-xl font-bold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">{feature.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default LandingPage;