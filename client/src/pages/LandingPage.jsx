import { Link } from 'react-router-dom';

const coreActions = ['Create', 'Customize', 'Monetize'];

const trustedCreators = [
  'AaryaLive',
  'SkyHorizon',
  'Crystal18',
  'ShuvaStream',
  'KhatraCast',
  'RitikaSLAYs',
  'MinaMoods',
  'ZonePlay',
  'WavesWithYou',
  'TheChillRoom'
];

const audienceCards = [
  {
    title: 'For content creators',
    text: 'Receive tips, reward supporters, and keep your audience engaged with polished creator tools.'
  },
  {
    title: 'For live streamers',
    text: 'Turn on live alerts, message overlays, and donation flows that feel instant and responsive.'
  }
];

const platformFeatures = [
  {
    title: 'Multiple payment options',
    text: 'Accept tips through gateway-ready payment methods and keep the payment flow flexible.'
  },
  {
    title: 'Local payout support',
    text: 'Track balances and withdrawals with a structure that can support local currencies and settlement paths.'
  },
  {
    title: 'Compliance-friendly setup',
    text: 'Use a donation platform architecture that can adapt to region-specific rules and payment requirements.'
  }
];

const toolkitFeatures = [
  {
    title: 'Tipping',
    subtitle: 'Earn from audience support',
    text: 'Collect tips, track contribution history, and keep every supporter interaction in one place.'
  },
  {
    title: 'Link in bio',
    subtitle: 'One link for everything',
    text: 'Share your creator profile, social links, and donation page from a single clean destination.'
  },
  {
    title: 'Streaming widgets',
    subtitle: 'Engage live viewers',
    text: 'Use alerts, overlays, goals, and live donation moments to keep streams interactive.'
  },
  {
    title: 'Multi-platform reach',
    subtitle: 'Everywhere, effortlessly',
    text: 'Grow a supporter base that can follow you across formats without rebuilding your presence.'
  }
];

function LandingPage() {
  return (
    <div className="space-y-10 pb-4">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {coreActions.map((item) => (
              <span key={item} className="pill bg-white/85 text-ink shadow-sm shadow-ink/5">
                {item}
              </span>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink/45">
              Creator monetization platform
            </p>
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Build a supporter-driven income stream for creators and streamers.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-ink/72 md:text-lg">
              DONATO helps creators receive tips, engage their audience, manage support, and grow sustainable earnings with a clean, modern platform experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="button-primary">
              Get started
            </Link>
            <Link to="/login" className="button-secondary">
              Sign in
            </Link>
            <Link to="/streamers" className="button-secondary">
              Explore creators
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="card p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Support flow</p>
              <p className="mt-1 font-display text-2xl font-bold">Fast tips</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Creator tools</p>
              <p className="mt-1 font-display text-2xl font-bold">Widgets</p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Revenue</p>
              <p className="mt-1 font-display text-2xl font-bold">Track earnings</p>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden p-0 shadow-[0_28px_70px_rgba(15,28,42,0.15)]">
          <div className="border-b border-white/10 bg-[linear-gradient(135deg,#0f1c2a_0%,#18304d_55%,#f39b17_160%)] px-6 py-5 text-white">
            <p className="text-sm uppercase tracking-[0.22em] text-white/70">Live creator dashboard</p>
            <h2 className="mt-2 font-display text-3xl font-bold">DONATO</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
              A creator-first monetization surface for tips, messages, and support tracking.
            </p>
          </div>

          <div className="space-y-4 bg-white p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="rounded-3xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Tips received</p>
                <p className="mt-1 font-display text-2xl font-bold">NPR 28,450</p>
              </div>
              <div className="rounded-3xl bg-paper p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Supporters</p>
                <p className="mt-1 font-display text-2xl font-bold">1,284</p>
              </div>
              <div className="rounded-3xl bg-paper p-4 md:col-span-1 col-span-2 md:col-auto">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Live sync</p>
                <p className="mt-1 font-display text-2xl font-bold">Instant</p>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-ink/10 bg-paper/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">A recent tip</p>
                  <p className="text-sm text-ink/65">Great stream, keep it going!</p>
                </div>
                <span className="pill bg-mint/20 text-mint">NPR 500</span>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-ink/10 bg-paper/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Second tip</p>
                  <p className="text-sm text-ink/65">Love the energy, here’s a boost.</p>
                </div>
                <span className="pill bg-glow/20 text-ink">NPR 1,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">Trusted by creators</p>
            <h2 className="mt-2 font-display text-3xl font-bold">A creator directory that feels alive</h2>
          </div>
          <Link to="/streamers" className="button-secondary">
            Browse all streamers
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {trustedCreators.map((creator) => (
            <Link
              key={creator}
              to="/streamers"
              className="rounded-2xl border border-ink/10 bg-white px-4 py-4 text-center text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-md"
            >
              {creator}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {audienceCards.map((item) => (
          <article key={item.title} className="card p-6">
            <span className="pill bg-glow/20 text-ink">Designed for all creators</span>
            <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/70">{item.text}</p>
            <div className="mt-6 rounded-3xl bg-paper p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/45">Built for</p>
              <p className="mt-1 font-semibold">Creators, streamers, audience engagement</p>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">Platform features</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Everything you need in one platform</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {platformFeatures.map((feature) => (
            <article key={feature.title} className="card p-6">
              <h3 className="font-display text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {toolkitFeatures.map((feature) => (
          <article key={feature.title} className="card overflow-hidden p-0">
            <div className="bg-ink px-6 py-4 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">{feature.title}</p>
              <h3 className="mt-2 font-display text-2xl font-bold">{feature.subtitle}</h3>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm leading-6 text-ink/70">{feature.text}</p>
              <div className="h-44 rounded-3xl bg-[linear-gradient(135deg,rgba(15,28,42,0.9)_0%,rgba(243,155,23,0.5)_100%)]" />
            </div>
          </article>
        ))}
      </section>

      <section className="card overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
          <div className="bg-[linear-gradient(135deg,#101827_0%,#1e3a5f_45%,#f39b17_160%)] p-8 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-white/70">Get started today</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight">
              Build a supporter-driven income with DONATO.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
              Make your page feel premium, let supporters tip in a few clicks, and manage your creator economy from one place.
            </p>
          </div>
          <div className="space-y-4 bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">Start now</p>
            <p className="text-sm leading-6 text-ink/70">
              Sign up to create your profile, browse creators, and use the monetization tools built into DONATO.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="button-primary">
                Join DONATO
              </Link>
              <Link to="/login" className="button-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
