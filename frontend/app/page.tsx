"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import HeroIllustration from "@/components/ui/HeroIllustration";
import ConnectButton from "@/components/wallet/ConnectButton";
import { useBondCounter } from "@/hooks/useCoSigned";
import type { Variants } from "framer-motion";

// ─── Static data ──────────────────────────────────────────────────────────────

const steps = [
  { n: "01", title: "Mentor Creates",  desc: "Defines the skill, success criteria, and deadline. Evidence is uploaded to IPFS before the Bond goes on-chain." },
  { n: "02", title: "Learner Accepts", desc: "Stakes ETH as a commitment signal. The stake is held in the contract and refunded in full on completion." },
  { n: "03", title: "Work Happens",    desc: "The real mentorship — calls, code reviews, projects. All off-chain. The Bond holds the record." },
  { n: "04", title: "Both Co-Sign",    desc: "Either party signs first. The second signature completes the Bond. Neither can fake it alone." },
  { n: "05", title: "NFTs Minted",     desc: "A soulbound credential is minted to both wallets. Permanent, non-transferable, verifiable on-chain." },
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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { count, isLoading: statsLoading } = useBondCounter();
  const { address } = useAccount();

  // Auto-redirect to dashboard when wallet connects
  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  // Stats

  const totalBonds     = statsLoading ? "—" : count.toString();
  const coSigned       = statsLoading ? "—" : count.toString(); // same as total — every bond that exists was co-signed
  const activeMentors  = "—"; // requires subgraph — placeholder until Day 25

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-syne)]"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <Logo width={180} height={46} />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span
              className="hidden sm:inline text-xs font-[family-name:var(--font-dm-mono)] px-3 py-1 rounded"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Base Sepolia
            </span>
            <button
              onClick={() => router.push("/dashboard")}
              className="hidden sm:inline text-xs font-[family-name:var(--font-dm-mono)] px-3 py-1 rounded"
              style={{ color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", cursor: "pointer", minHeight: 44, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F0F0F5")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              aria-label="Go to dashboard"
            >
              Dashboard
            </button>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-8 pt-24 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h1
              variants={fadeUp}
              className="font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(40px, 5vw, 64px)", color: "#F0F0F5" }}
            >
              Your skills.{" "}
              <span style={{ color: "#E8FF47" }}>Witnessed</span>
              {" "}on-chain.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base leading-relaxed mb-10"
              style={{ color: "rgba(240,240,245,0.72)", maxWidth: 480 }}
            >
              CoSigned is a dual-signature mentorship protocol. Mentor and learner
              co-sign a Bond on-chain. When both sign, a soulbound NFT is minted to
              each — proof that can never be faked, transferred, or revoked.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-row gap-4">
              <button
                onClick={() => router.push("/bond/create")}
                style={{
                  backgroundColor: "#4DFFD2", color: "#0A0A0F",
                  fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 15,
                  padding: "16px 32px", borderRadius: 12, border: "none",
                  cursor: "pointer", minHeight: 44,
                  transition: "background-color 200ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#E8FF47")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#4DFFD2")}
                aria-label="Start a Bond"
              >
                Start a Bond
              </button>
              <button
                onClick={() => router.push("/explore")}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(240,240,245,0.2)",
                  color: "rgba(240,240,245,0.5)",
                  fontFamily: "var(--font-syne, sans-serif)", fontWeight: 500, fontSize: 14,
                  padding: "16px 32px", borderRadius: 12,
                  cursor: "pointer", minHeight: 44,
                  transition: "border-color 200ms ease, color 200ms ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(240,240,245,0.4)";
                  e.currentTarget.style.color = "rgba(240,240,245,0.8)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(240,240,245,0.2)";
                  e.currentTarget.style.color = "rgba(240,240,245,0.5)";
                }}
                aria-label="Explore open bonds"
              >
                Explore Bonds
              </button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={fadeUp}
              className="flex items-center mt-16 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {[
                { value: totalBonds, label: "Total Bonds Created" },
                null,
                { value: "Live", label: "On Base Sepolia", dot: true },
                null,
                { value: "2", label: "Contracts Verified" },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.08)", margin: "0 28px", flexShrink: 0 }} />
                ) : (
                  <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.dot && (
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          backgroundColor: "#4DFFD2",
                          boxShadow: "0 0 6px #4DFFD2",
                          animation: "pulse 2s ease-in-out infinite",
                          flexShrink: 0,
                        }} />
                      )}
                      <span style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 28, color: "#E8FF47", lineHeight: 1 }}>
                        {item.value}
                      </span>
                    </div>
                    <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      {item.label}
                    </span>
                  </div>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Right — illustration */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.25,0.1,0.25,1] }}
            className="hidden lg:block"
            style={{
              borderRadius: 20,
              padding: 20,
              border: "1px solid rgba(77,255,210,0.15)",
              backgroundColor: "rgba(77,255,210,0.03)",
            }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="px-8 py-24"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>
              How It Works
            </h2>
            <span className="text-xs font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--text-muted)" }}>
              5 steps
            </span>
          </div>

          <motion.div
            className="divide-y"
            style={{ borderColor: "var(--border)" }}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.n}
                variants={fadeUp}
                className="grid grid-cols-12 gap-6 py-7 items-start"
              >
                <span className="col-span-1 text-xs font-[family-name:var(--font-dm-mono)] pt-0.5" style={{ color: "var(--text-muted)" }}>
                  {step.n}
                </span>
                <h3 className="col-span-3 font-bold text-base" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="col-span-8 text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why CoSigned ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="text-2xl font-black" style={{ color: "var(--text)" }}>
            Why CoSigned
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-px"
          style={{ backgroundColor: "var(--border)" }}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {reasons.map(({ label, body, stat, statLabel }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex flex-col justify-between p-8 gap-8"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-[family-name:var(--font-dm-mono)] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                  {body}
                </p>
              </div>
              <div className="pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-2xl font-black" style={{ color: "var(--text)" }}>{stat}</p>
                <p className="text-xs font-[family-name:var(--font-dm-mono)] mt-1" style={{ color: "var(--text-muted)" }}>{statLabel}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-10">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4" style={{ color: "var(--text)" }}>
              Ready to get
              <br />
              CoSigned?
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Connect your wallet and start a Bond today.
            </p>
          </div>
          <button
            onClick={() => router.push("/bond/create")}
            className="self-start sm:self-auto px-10 py-4 rounded font-bold text-base transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ backgroundColor: "var(--accent)", color: "#0D0D0D" }}
            aria-label="Start a Bond"
          >
            Start a Bond Today
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Logo variant="icon" width={28} height={28} />
        <p className="text-xs font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--text-muted)" }}>
          CoSigned — Your skills. Witnessed on-chain.
        </p>
        <p className="text-xs font-[family-name:var(--font-dm-mono)]" style={{ color: "var(--text-muted)" }}>
          Built on Base Sepolia
        </p>
      </footer>
    </div>
  );
}
