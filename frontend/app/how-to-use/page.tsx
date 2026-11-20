import type { Metadata } from "next";
import type { ReactNode } from "react";
import { chain } from "@/lib/config";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "How it works",
  description: "A guide to creating, accepting and co-signing mentorship bonds on CoSigned.",
};

const MENTOR_STEPS = [
  {
    title: "Create the bond",
    body: "Enter the learner's wallet address, the skill, what success looks like, and a deadline. You can add display names for the credential. Creating a bond costs only gas.",
  },
  {
    title: "Share the bond link",
    body: "The learner opens the bond page from their own wallet to accept it. Only the address you named can accept.",
  },
  {
    title: "Do the work, then sign",
    body: "Once the success criteria are met, sign completion from the bond page. If the learner has already signed, your signature completes the bond.",
  },
];

const LEARNER_STEPS = [
  {
    title: "Accept and stake",
    body: "Open the bond your mentor created and choose a stake (minimum 0.001 ETH). It's held by the contract as a signal of commitment.",
  },
  {
    title: "Complete the criteria",
    body: "Work through what you agreed. Everything off-chain — calls, reviews, projects — happens however suits you both.",
  },
  {
    title: "Sign and collect",
    body: "Sign completion. When both signatures are in, your stake is refunded and a soulbound credential lands in your wallet.",
  },
];

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "What do I need to get started?",
    a: (
      <>
        A wallet such as MetaMask or Coinbase Wallet, connected to {chain.name}, plus a little test ETH for gas. You can
        get test ETH from a Base Sepolia faucet.
      </>
    ),
  },
  {
    q: "Why does the learner stake ETH?",
    a: "It signals commitment. The stake is never paid to the mentor — it's returned to the learner when the bond completes or a dispute resolves.",
  },
  {
    q: "What if the deadline passes before we both sign?",
    a: "You can still sign; signing has no deadline. But if the bond is active with no signatures yet, either party can raise a dispute once the deadline has passed. After a 7-day window anyone can trigger the refund of the learner's stake, and no credentials are minted.",
  },
  {
    q: "What if the learner never accepts?",
    a: "A pending bond simply expires at its deadline. No funds are involved until the learner accepts.",
  },
  {
    q: "Can a credential be transferred or deleted?",
    a: "No. Credentials follow ERC-5192: they're permanently locked to the wallet that earned them. Transfers and approvals revert.",
  },
  {
    q: "Who can see my bonds?",
    a: "Everyone. Bonds live on a public blockchain — that's what makes them verifiable. Don't put private information in the skill title or criteria.",
  },
];

function StepList({ label, steps }: { label: string; steps: { title: string; body: string }[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <p className="eyebrow mb-6">{label}</p>
      <ol className="space-y-7">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 font-mono text-xs text-accent-ink ring-1 ring-accent/25">
              {i + 1}
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function HowToUsePage() {
  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Guide"
        title="How CoSigned works"
        description="A bond is an on-chain agreement between one mentor and one learner. It completes only when both of them sign — and then each receives a credential that can't be faked, sold or revoked."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StepList label="If you're the mentor" steps={MENTOR_STEPS} />
        <StepList label="If you're the learner" steps={LEARNER_STEPS} />
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Questions</h2>
          <p className="text-fg-muted">The rules below are enforced by the contract, not by us.</p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {q}
                <span className="text-xl leading-none text-fg-subtle transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-20 flex flex-wrap gap-3">
        <ButtonLink href="/bond/create" size="lg">Create a bond</ButtonLink>
        <ButtonLink href="/explore" size="lg" variant="secondary">Explore bonds</ButtonLink>
      </div>
    </div>
  );
}
