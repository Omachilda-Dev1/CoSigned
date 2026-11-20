"use client";

import { useMemo, useState } from "react";
import type { Address } from "viem";
import { BondStatus, type Bond } from "@/types/bond";
import { availableActions, roleOf } from "@/lib/bond";
import { cn } from "@/lib/cn";
import { useBondsForAddress } from "@/hooks/useBonds";
import { ButtonLink } from "@/components/ui/Button";
import { GraduationCap, Plus, User, Users } from "@/components/ui/icons";
import { EmptyState, PageHeader, Stat } from "@/components/ui/primitives";
import { BondCard, BondCardSkeleton } from "@/components/bond/BondCard";
import { WalletGuard } from "@/components/wallet/WalletGuard";

type Filter = "action" | "mentoring" | "learning" | "all";

export function Dashboard() {
  return (
    <WalletGuard title="Connect to see your bonds" body="Your dashboard lists every bond where you're the mentor or the learner.">
      {(address) => <DashboardContent address={address} />}
    </WalletGuard>
  );
}

function needsAction(bond: Bond, address: Address) {
  const a = availableActions(bond, address);
  return a.accept || a.sign || a.dispute || a.resolve;
}

function DashboardContent({ address }: { address: Address }) {
  const { bonds, isLoading, error } = useBondsForAddress(address);

  const groups = useMemo(() => {
    const mentoring = bonds.filter((b) => roleOf(b, address) === "mentor");
    const learning = bonds.filter((b) => roleOf(b, address) === "learner");
    const action = bonds.filter((b) => needsAction(b, address));
    const completed = bonds.filter((b) => b.status === BondStatus.Completed);
    return { mentoring, learning, action, completed, all: bonds };
  }, [bonds, address]);

  const [filter, setFilter] = useState<Filter | null>(null);
  const active: Filter = filter ?? (groups.action.length > 0 ? "action" : "all");
  const visible = groups[active];

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "action", label: "Needs action", count: groups.action.length },
    { key: "mentoring", label: "Mentoring", count: groups.mentoring.length },
    { key: "learning", label: "Learning", count: groups.learning.length },
    { key: "all", label: "All", count: groups.all.length },
  ];

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow="Dashboard"
        title="Your bonds"
        description="Every mentorship you're part of, and what each one needs next."
        actions={
          <>
            <ButtonLink href={`/profile/${address}`} variant="secondary" icon={<User size={16} />}>
              Public profile
            </ButtonLink>
            <ButtonLink href="/bond/create" icon={<Plus size={16} />}>
              New bond
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-4">
        <Stat label="Mentoring" value={isLoading ? "—" : groups.mentoring.length} />
        <Stat label="Learning" value={isLoading ? "—" : groups.learning.length} />
        <Stat label="Needs action" value={isLoading ? "—" : groups.action.length} />
        <Stat label="Credentials" value={isLoading ? "—" : groups.completed.length} />
      </div>

      <div className="mt-10 flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Filter bonds">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors",
              active === t.key ? "border-accent text-fg" : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
            {!isLoading && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-px font-mono text-[11px]",
                  t.key === "action" && t.count > 0 ? "bg-accent text-accent-fg" : "bg-raised text-fg-subtle",
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {error ? (
          <EmptyState title="Couldn't load your bonds" body="The network request failed. Refresh to try again." />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <BondCardSkeleton key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <DashboardEmpty filter={active} hasBonds={bonds.length > 0} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((bond) => (
              <BondCard key={bond.id.toString()} bond={bond} perspective={roleOf(bond, address) ?? undefined} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardEmpty({ filter, hasBonds }: { filter: Filter; hasBonds: boolean }) {
  if (!hasBonds) {
    return (
      <EmptyState
        icon={<Users size={20} />}
        title="No bonds yet"
        body="Create a bond to mentor someone, or find an open bond to learn from."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/bond/create">Create a bond</ButtonLink>
            <ButtonLink href="/explore" variant="secondary">Explore</ButtonLink>
          </div>
        }
      />
    );
  }
  const copy: Record<Filter, { title: string; body: string }> = {
    action: { title: "You're all caught up", body: "Nothing needs your signature right now." },
    mentoring: { title: "Not mentoring anyone yet", body: "Create a bond to start mentoring on-chain." },
    learning: { title: "Not learning from anyone yet", body: "Ask a mentor to create a bond for your wallet address." },
    all: { title: "No bonds", body: "" },
  };
  return (
    <EmptyState
      icon={filter === "learning" ? <GraduationCap size={20} /> : <Users size={20} />}
      title={copy[filter].title}
      body={copy[filter].body}
    />
  );
}
