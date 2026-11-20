"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { BondStatus } from "@/types/bond";
import { useBond, useBondMetadata } from "@/hooks/useBonds";
import { roleOf } from "@/lib/bond";
import { contracts, explorerUrl } from "@/lib/config";
import { gatewayUrl } from "@/lib/ipfs";
import { formatDate, formatEth, formatRelative, nowSeconds, sameAddress } from "@/lib/format";
import { AddressChip } from "@/components/ui/Address";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, Search } from "@/components/ui/icons";
import { Card, CardHeader, EmptyState, Skeleton } from "@/components/ui/primitives";
import { BondActions } from "@/components/bond/BondActions";
import { BondTimeline } from "@/components/bond/BondTimeline";
import { StatusBadge } from "@/components/bond/StatusBadge";
import { Certificate } from "@/components/credential/Certificate";
import { CredentialPanel } from "@/components/credential/CredentialPanel";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <dt className="eyebrow">{label}</dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  );
}

export function BondView({ bondId }: { bondId: string }) {
  const { address } = useAccount();
  const { bond, isLoading, error } = useBond(BigInt(bondId));
  const { data: metadata } = useBondMetadata(bond?.ipfsHash);

  if (isLoading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-6 h-10 w-2/3 max-w-md" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !bond) {
    return (
      <div className="container py-16">
        <EmptyState
          icon={<Search size={20} />}
          title={error ? "Couldn't load this bond" : `Bond #${bondId} doesn't exist`}
          body={error ? "The network request failed. Check your connection and try again." : "It may not have been created yet, or the link is wrong."}
          action={<ButtonLink href="/explore" variant="secondary">Browse open bonds</ButtonLink>}
        />
      </div>
    );
  }

  const role = roleOf(bond, address);
  const now = nowSeconds();
  const mentorName = metadata?.properties?.mentorName;
  const learnerName = metadata?.properties?.learnerName;
  const metadataLink = gatewayUrl(bond.ipfsHash);
  const completed = bond.status === BondStatus.Completed;

  return (
    <div className="container py-10">
      <Link href={address ? "/dashboard" : "/explore"} className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft size={15} /> {address ? "Dashboard" : "Explore"}
      </Link>

      <header className="mt-6 flex flex-col gap-4 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="eyebrow">
            Bond #{bond.id.toString()}
            {role && <span className="text-accent-ink"> · You&apos;re the {role}</span>}
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">{bond.skillTitle}</h1>
        </div>
        <StatusBadge bond={bond} className="self-start text-xs" />
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title="Progress" />
            <div className="p-5">
              <BondTimeline bond={bond} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Details" />
            <dl className="grid gap-6 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Detail label="Success criteria">
                  <p className="whitespace-pre-line leading-relaxed text-fg">{bond.successCriteria}</p>
                </Detail>
              </div>
              <Detail label="Mentor">
                <AddressChip address={bond.mentor} name={mentorName} you={sameAddress(bond.mentor, address)} />
              </Detail>
              <Detail label="Learner">
                <AddressChip address={bond.learner} name={learnerName} you={sameAddress(bond.learner, address)} />
              </Detail>
              <Detail label="Deadline">
                {formatDate(bond.deadline)}
                <span className="text-fg-subtle"> · {formatRelative(bond.deadline, now)}</span>
              </Detail>
              <Detail label="Stake held">
                <span className="font-mono">
                  {bond.stakeAmount > 0n ? `${formatEth(bond.stakeAmount)} ETH` : bond.status === BondStatus.Pending ? "Set on acceptance" : "Refunded"}
                </span>
              </Detail>
            </dl>
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-5 py-3.5 text-xs text-fg-subtle">
              <a href={explorerUrl.address(contracts.cosigned)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
                Contract on BaseScan <ExternalLink size={12} />
              </a>
              {metadataLink && (
                <a href={metadataLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-fg">
                  IPFS metadata <ExternalLink size={12} />
                </a>
              )}
            </div>
          </Card>

          {completed ? (
            <section className="space-y-3">
              <h2 className="eyebrow">Credential</h2>
              <CredentialPanel
                isParty={!!role}
                skillTitle={bond.skillTitle}
                learner={bond.learner}
                mentor={bond.mentor}
                learnerName={learnerName}
                mentorName={mentorName}
                bondId={bond.id.toString()}
                variant={role === "mentor" ? "mentor" : "learner"}
              />
            </section>
          ) : (
            <section className="space-y-3">
              <h2 className="eyebrow">Credential preview</h2>
              <div className="opacity-90">
                <Certificate
                  state="pending"
                  skillTitle={bond.skillTitle}
                  learner={bond.learner}
                  mentor={bond.mentor}
                  learnerName={learnerName}
                  mentorName={mentorName}
                  bondId={bond.id.toString()}
                />
              </div>
              <p className="text-xs text-fg-subtle">Minted as a soulbound token to both wallets once the bond is co-signed.</p>
            </section>
          )}
        </div>

        <aside className="order-first lg:sticky lg:top-24 lg:order-last">
          <Card>
            <CardHeader title={role ? "Your next step" : "Actions"} />
            <div className="p-5">
              <BondActions bond={bond} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
