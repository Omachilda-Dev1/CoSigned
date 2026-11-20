"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { BondStatus, type Bond } from "@/types/bond";
import { roleOf } from "@/lib/bond";
import { explorerUrl, siteConfig } from "@/lib/config";
import { sameAddress, shortAddress } from "@/lib/format";
import { useBondsForAddress } from "@/hooks/useBonds";
import { Avatar, CopyButton } from "@/components/ui/Address";
import { ArrowRight, ExternalLink, Lock, Shield } from "@/components/ui/icons";
import { EmptyState, Skeleton, Stat } from "@/components/ui/primitives";
import { StatusBadge } from "@/components/bond/StatusBadge";

export function ProfileView({ address }: { address: Address }) {
  const { address: connected } = useAccount();
  const { bonds, isLoading, error } = useBondsForAddress(address);
  const isOwn = sameAddress(connected, address);

  const { credentials, asMentor, asLearner } = useMemo(() => {
    const credentials = bonds.filter((b) => b.status === BondStatus.Completed);
    return {
      credentials,
      asMentor: credentials.filter((b) => roleOf(b, address) === "mentor").length,
      asLearner: credentials.filter((b) => roleOf(b, address) === "learner").length,
    };
  }, [bonds, address]);

  const profileUrl = `${siteConfig.url}/profile/${address}`;

  return (
    <div className="container py-10">
      <header className="flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-5">
          <Avatar address={address} size={72} />
          <div className="min-w-0 space-y-1.5">
            <p className="eyebrow">{isOwn ? "Your public profile" : "Profile"}</p>
            <h1 className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">{shortAddress(address, 6)}</h1>
            <div className="flex items-center gap-1 text-sm text-fg-subtle">
              <span className="hidden truncate font-mono text-xs sm:inline">{address}</span>
              <CopyButton value={address} label="Copy address" />
              <a
                href={explorerUrl.address(address)}
                target="_blank"
                rel="noreferrer"
                className="inline-grid size-7 place-items-center rounded-md hover:bg-raised hover:text-fg"
                aria-label="View on BaseScan"
                title="View on BaseScan"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Stat label="Credentials" value={isLoading ? "—" : credentials.length} />
          <Stat label="As mentor" value={isLoading ? "—" : asMentor} />
          <Stat label="As learner" value={isLoading ? "—" : asLearner} />
        </div>
      </header>

      {isOwn && (
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-fg-muted">
          Share your profile:
          <span className="truncate font-mono text-xs text-fg">{profileUrl}</span>
          <CopyButton value={profileUrl} label="Copy profile link" />
        </div>
      )}

      <section className="mt-10">
        <h2 className="mb-5 text-xl font-semibold">Earned credentials</h2>
        {error ? (
          <EmptyState title="Couldn't load credentials" body="Refresh to try again." />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : credentials.length === 0 ? (
          <EmptyState
            icon={<Shield size={20} />}
            title="No credentials yet"
            body="Credentials appear here once a bond is co-signed by both mentor and learner."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {credentials.map((bond) => (
              <CredentialTile key={bond.id.toString()} bond={bond} role={roleOf(bond, address) ?? "learner"} />
            ))}
          </div>
        )}
      </section>

      {!isLoading && bonds.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xl font-semibold">Bond history</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {bonds.map((bond) => {
              const role = roleOf(bond, address);
              const other = role === "mentor" ? bond.learner : bond.mentor;
              return (
                <li key={bond.id.toString()}>
                  <Link href={`/bond/${bond.id}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-raised/60">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{bond.skillTitle}</p>
                      <p className="text-sm text-fg-subtle">
                        {role === "mentor" ? "Mentor to" : "Learner with"}{" "}
                        <span className="font-mono">{shortAddress(other)}</span>
                      </p>
                    </div>
                    <StatusBadge bond={bond} />
                    <ArrowRight size={15} className="hidden text-fg-subtle group-hover:text-accent-ink sm:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function CredentialTile({ bond, role }: { bond: Bond; role: "mentor" | "learner" }) {
  const mentor = role === "mentor";
  return (
    <Link
      href={`/bond/${bond.id}`}
      className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl border border-accent/25 bg-surface p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent/50"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-accent/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${mentor ? "text-lime" : "text-accent-ink"}`}>
          {mentor ? "Mentor proof" : "Learner proof"}
        </span>
        <Lock size={14} className="text-fg-subtle" />
      </div>
      <p className="relative line-clamp-2 font-display text-lg font-semibold leading-snug">{bond.skillTitle}</p>
      <div className="relative flex items-center justify-between text-xs text-fg-subtle">
        <span>Soulbound · Base</span>
        <span className="font-mono">#{bond.id.toString()}</span>
      </div>
    </Link>
  );
}
