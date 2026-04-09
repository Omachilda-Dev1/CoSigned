import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HeroIllustration from "@/components/ui/HeroIllustration";

const steps = [
  {
    n: "01",
    title: "Mentor Creates",
    desc: "Defines the skill, success criteria, and deadline. Evidence is uploaded to IPFS before the Bond goes on-chain.",
  },
  {
    n: "02",
    title: "Learner Accepts",
    desc: "Stakes ETH as a commitment signal. The stake is held in the contract and refunded in full on completion.",
  },
  {
    n: "03",
    title: "Work Happens",
    desc: "The real mentorship — calls, code reviews, projects. All off-chain. The Bond holds the record.",
  },
  {
    n: "04",
    title: "Both Co-Sign",
    desc: "Either party signs first. The second signature completes the Bond. Neither can fake it alone.",
  },
  {
    n: "05",
    title: "NFTs Minted",
    desc: "A soulbound credential is minted to both wallets. Permanent, non-transferable, verifiable on-chain.",
  },
];

const reasons = [
  {
    label: "Trustless",
    body: "Both signatures are required. The smart contract enforces it — no platform, no admin, no override.",
    stat: "2-of-2",
    statLabel: "signatures required",
  },
  {
    label: "Permanent",
    body: "Soulbound NFTs cannot be transferred or deleted. The credential lives on Base for as long as the chain does.",
    stat: "ERC-5192",
    statLabel: "soulbound standard",
  },
  {
    label: "Verifiable",
    body: "Every Bond is public on BaseScan. Anyone can verify a mentorship happened — no institution required.",
    stat: "On-chain",
    statLabel: "fully transparent",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen font-[family-name:var(--font-syne)]"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto"
        style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg)" }}
      >
        <Logo width={180} height={46} />

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <span
            className="hidden sm:inline text-xs font-[family-name:var(--font-dm-mono)] px-3 py-1 rounded"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            Base Sepolia
          </span>

          <button
            className="text-sm font-bold px-5 py-2 rounded transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "var(--accent)",
              color: "#0D0D0D",
            }}
            aria-label="Connect wallet"
          >
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-14 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <h1
              className="text-5xl sm:text-6xl font-black leading-[1.0] tracking-tight mb-6"
              style={{ color: "var(--text)" }}
            >
              Your skills.{" "}
              <span style={{ color: "var(--accent)" }}>
                Witnessed on-chain.
              </span>
            </h1>

            <p
              className="text-base sm:text-lg max-w-md leading-relaxed mb-8"
              style={{ color: "var(--text-sub)" }}
            >
              CoSigned is a dual-signature mentorship protocol. Mentor and learner
              co-sign a Bond on-chain. When both sign, a soulbound NFT is minted to
              each — proof that can never be faked, transferred, or revoked.
            </p>

            <div className="flex flex-row gap-3">
              <button
                className="px-7 py-3 rounded font-bold text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "var(--accent)", color: "#0D0D0D" }}
                aria-label="Start a Bond"
              >
                Start a Bond
              </button>
              <button
                className="px-7 py-3 rounded font-bold text-sm transition-opacity hover:opacity-70"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  backgroundColor: "transparent",
                }}
                aria-label="Explore open bonds"
              >
                Explore Bonds
              </button>
            </div>

            {/* Stats row */}
            <div
              className="flex gap-10 mt-12 pt-8"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {[
                { value: "—", label: "Total Bonds" },
                { value: "—", label: "CoSigned" },
                { value: "—", label: "Active Mentors" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-2xl font-black tabular-nums"
                    style={{ color: "var(--text)" }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-xs mt-1 font-[family-name:var(--font-dm-mono)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — illustration */}
          <div
            className="rounded-xl p-4 hidden lg:block"
            style={{
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-card)",
            }}
          >
            <HeroIllustration />
          </div>

        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section
        className="px-6 py-20"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>
              How It Works
            </h2>
            <span
              className="text-xs font-[family-name:var(--font-dm-mono)]"
              style={{ color: "var(--text-muted)" }}
            >
              5 steps
            </span>
          </div>

          {/* Editorial list — not a card grid */}
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {steps.map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-12 gap-6 py-7 items-start"
              >
                {/* Step number */}
                <span
                  className="col-span-1 text-xs font-[family-name:var(--font-dm-mono)] pt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {step.n}
                </span>

                {/* Title */}
                <h3
                  className="col-span-3 font-bold text-base"
                  style={{ color: "var(--text)" }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="col-span-8 text-sm leading-relaxed"
                  style={{ color: "var(--text-sub)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why CoSigned ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>
            Why CoSigned
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px"
          style={{ backgroundColor: "var(--border)" }}
        >
          {reasons.map(({ label, body, stat, statLabel }) => (
            <div
              key={label}
              className="flex flex-col justify-between p-8 gap-8"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              {/* Top: label + body */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-xs font-[family-name:var(--font-dm-mono)] uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-sub)" }}
                >
                  {body}
                </p>
              </div>

              {/* Bottom: stat callout */}
              <div
                className="pt-6"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  className="text-2xl font-black"
                  style={{ color: "var(--text)" }}
                >
                  {stat}
                </p>
                <p
                  className="text-xs font-[family-name:var(--font-dm-mono)] mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {statLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-24"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-10">
          <div>
            <h2
              className="text-4xl sm:text-5xl font-black leading-tight mb-4"
              style={{ color: "var(--text)" }}
            >
              Ready to get
              <br />
              CoSigned?
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Connect your wallet and start a Bond today.
            </p>
          </div>

          <button
            className="self-start sm:self-auto px-10 py-4 rounded font-bold text-base transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ backgroundColor: "var(--accent)", color: "#0D0D0D" }}
            aria-label="Start a Bond"
          >
            Start a Bond Today
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="px-6 py-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Logo variant="icon" width={28} height={28} />
        <p
          className="text-xs font-[family-name:var(--font-dm-mono)]"
          style={{ color: "var(--text-muted)" }}
        >
          CoSigned — Your skills. Witnessed on-chain.
        </p>
        <p
          className="text-xs font-[family-name:var(--font-dm-mono)]"
          style={{ color: "var(--text-muted)" }}
        >
          Built on Base Sepolia
        </p>
      </footer>
    </div>
  );
}
