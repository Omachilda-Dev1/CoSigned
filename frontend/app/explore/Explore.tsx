"use client";

import { useMemo, useState } from "react";
import { BondStatus, type Bond } from "@/types/bond";
import { isOpenForAcceptance } from "@/lib/bond";
import { cn } from "@/lib/cn";
import { useAllBonds } from "@/hooks/useBonds";
import { ButtonLink } from "@/components/ui/Button";
import { Search } from "@/components/ui/icons";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { BondCard, BondCardSkeleton } from "@/components/bond/BondCard";

type StatusFilter = "all" | "open" | "in-progress" | "completed" | "disputed";
type Sort = "newest" | "deadline";

const FILTERS: { key: StatusFilter; label: string; match: (b: Bond) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "open", label: "Awaiting learner", match: (b) => isOpenForAcceptance(b) },
  {
    key: "in-progress",
    label: "In progress",
    match: (b) =>
      b.status === BondStatus.Active || b.status === BondStatus.MentorSigned || b.status === BondStatus.LearnerSigned,
  },
  { key: "completed", label: "Completed", match: (b) => b.status === BondStatus.Completed },
  { key: "disputed", label: "Disputed", match: (b) => b.status === BondStatus.Disputed },
];

export function Explore() {
  const { bonds, count, isLoading, error } = useAllBonds();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.key, bonds.filter(f.match).length])) as Record<StatusFilter, number>,
    [bonds],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = FILTERS.find((f) => f.key === filter)!.match;
    return bonds
      .filter(match)
      .filter((b) => !q || b.skillTitle.toLowerCase().includes(q) || b.mentor.toLowerCase().includes(q) || b.learner.toLowerCase().includes(q))
      .sort((a, b) => (sort === "deadline" ? Number(a.deadline - b.deadline) : Number(b.id - a.id)));
  }, [bonds, filter, sort, query]);

  return (
    <div className="container py-10">
      <PageHeader
        eyebrow={isLoading ? "Registry" : `${count.toString()} bonds on-chain`}
        title="Explore bonds"
        description="Every mentorship on CoSigned is public. Browse what's being taught, who's teaching it, and which credentials have been earned."
        actions={<ButtonLink href="/bond/create">Create a bond</ButtonLink>}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors",
                filter === f.key
                  ? "border-accent/40 bg-accent/10 text-accent-ink"
                  : "border-line text-fg-muted hover:border-fg-subtle/50 hover:text-fg",
              )}
            >
              {f.label}
              {!isLoading && <span className="font-mono text-[11px] opacity-70">{counts[f.key]}</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <label className="relative flex-1 lg:w-72 lg:flex-none">
            <span className="sr-only">Search bonds</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skill or address"
              className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15"
            />
          </label>
          <label className="sr-only" htmlFor="sort">Sort</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-lg border border-line bg-surface px-3 text-sm text-fg focus:border-accent focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState title="Couldn't load bonds" body="The network request failed. Refresh to try again." />
        ) : isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <BondCardSkeleton key={i} />)}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Search size={20} />}
            title={bonds.length === 0 ? "No bonds yet" : "No bonds match"}
            body={bonds.length === 0 ? "Be the first to create one." : "Try a different filter or search."}
            action={bonds.length === 0 ? <ButtonLink href="/bond/create">Create a bond</ButtonLink> : undefined}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((bond) => <BondCard key={bond.id.toString()} bond={bond} />)}
          </div>
        )}
      </div>
    </div>
  );
}
