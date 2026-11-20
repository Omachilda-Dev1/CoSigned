import Link from "next/link";
import { chain, contracts, explorerUrl } from "@/lib/config";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, ExternalLink } from "@/components/ui/icons";
import { Certificate } from "@/components/credential/Certificate";
import { LiveBondCount } from "./LiveBondCount";

const STEPS = [
  { title: "Mentor creates a bond", body: "Names the skill, the success criteria and a deadline, for one specific learner." },
  { title: "Learner stakes to accept", body: "ETH goes into the contract as a commitment — refunded in full on completion." },
  { title: "The work happens", body: "Calls, reviews, projects. Off-chain, on your terms. The bond holds the agreement." },
  { title: "Both co-sign", body: "Either can sign first. The bond completes only when the second signature lands." },
  { title: "Credentials minted", body: "Each wallet receives a soulbound token. Permanent, non-transferable, verifiable." },
];

const PRINCIPLES = [
  { stat: "2 of 2", title: "Neither side can fake it", body: "The contract requires both signatures. No platform, admin key or override." },
  { stat: "ERC-5192", title: "Bound to the wallet", body: "Credentials can't be sold, transferred or quietly revoked. They're yours." },
  { stat: "Public", title: "Verifiable by anyone", body: "Every bond and credential is on Base. Share a link — no institution required." },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_70%_20%,rgb(var(--accent)/0.12),transparent_70%)]"
        />
        <div className="container relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1fr_1.05fr] lg:pt-24">
          <div className="animate-fade-up space-y-7">
            <a
              href={explorerUrl.address(contracts.cosigned)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-fg-muted hover:text-fg"
            >
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--accent))]" />
              Live on {chain.name} · verified contracts
              <ExternalLink size={12} />
            </a>
            <h1 className="text-[2.75rem] font-extrabold leading-[1.02] sm:text-6xl">
              Your skills.
              <br />
              <span className="text-accent-ink">Witnessed</span> on-chain.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-fg-muted">
              Mentor and learner co-sign a bond on Base. When both sign, each receives a soulbound credential — proof of
              real mentorship that neither side can fake alone.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/bond/create" size="lg">
                Start a bond <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/how-to-use" size="lg" variant="secondary">
                How it works
              </ButtonLink>
            </div>
            <LiveBondCount />
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="rotate-[1.5deg] rounded-[22px] shadow-glow transition-transform duration-500 hover:rotate-0">
              <Certificate
                state="completed"
                skillTitle="Smart Contract Security"
                learnerName="Ada Okafor"
                mentorName="Tomás Reyes"
                bondId="42"
                issuedOn="12 Mar 2026"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/50">
        <div className="container grid gap-10 py-16 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="space-y-3">
              <p className="font-mono text-sm text-accent-ink">{p.stat}</p>
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-fg-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-24">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">The lifecycle</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Five steps, two signatures.</h2>
          </div>
          <Link href="/how-to-use" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
            Read the full guide <ArrowRight size={14} />
          </Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 bg-surface p-6">
              <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
              <h3 className="font-display text-lg font-semibold leading-snug">{s.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container">
        <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface px-8 py-14 sm:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-accent/15 blur-3xl"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-bold sm:text-4xl">Mentoring someone right now?</h2>
              <p className="text-fg-muted">
                Put it on-chain. It takes a minute to create a bond, and you only pay gas.
              </p>
            </div>
            <ButtonLink href="/bond/create" size="lg">
              Create a bond
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
