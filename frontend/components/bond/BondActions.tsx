"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { BondStatus, type Bond } from "@/types/bond";
import { availableActions, disputeResolvableAt, roleOf } from "@/lib/bond";
import { DEFAULT_STAKE_ETH, MIN_STAKE_ETH } from "@/lib/config";
import { formatDate, formatEth, formatRelative, nowSeconds } from "@/lib/format";
import { useBondTransaction } from "@/hooks/useBondTransaction";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Callout } from "@/components/ui/primitives";
import { Pen, Shield } from "@/components/ui/icons";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { TxStatus } from "@/components/bond/TxStatus";

function validStake(value: string): string | null {
  try {
    if (!value.trim()) return "Enter a stake amount.";
    if (parseEther(value) < parseEther(MIN_STAKE_ETH)) return `Minimum stake is ${MIN_STAKE_ETH} ETH.`;
    return null;
  } catch {
    return "Enter a valid ETH amount.";
  }
}

/** Every on-chain action available to the connected wallet for this bond. */
export function BondActions({ bond }: { bond: Bond }) {
  const { address } = useAccount();
  const tx = useBondTransaction();
  const [stake, setStake] = useState(DEFAULT_STAKE_ETH);
  const [confirmDispute, setConfirmDispute] = useState(false);

  const role = roleOf(bond, address);
  const actions = availableActions(bond, address);
  const now = nowSeconds();
  const stakeError = validStake(stake);
  const status = <TxStatus phase={tx.phase} hash={tx.hash} error={tx.error} />;

  // Anyone can trigger dispute resolution — show it before the wallet gate.
  if (bond.status === BondStatus.Disputed) {
    const resolvableAt = disputeResolvableAt(bond);
    if (bond.stakeAmount === 0n) {
      return <Callout tone="info" title="Dispute resolved">The learner&apos;s stake has been refunded. No credentials were minted.</Callout>;
    }
    return (
      <div className="space-y-4">
        <Callout tone="danger" title="Dispute open">
          {now < resolvableAt
            ? `The 7-day window closes ${formatRelative(resolvableAt, now)} (${formatDate(resolvableAt)}). After that, anyone can release the learner's ${formatEth(bond.stakeAmount)} ETH stake.`
            : `The window has closed. Anyone can now refund the learner's ${formatEth(bond.stakeAmount)} ETH stake.`}
        </Callout>
        {actions.resolve &&
          (address ? (
            <Button className="w-full" loading={tx.isBusy} disabled={tx.phase === "success"} onClick={() => tx.resolveDispute(bond.id)}>
              Resolve dispute &amp; refund stake
            </Button>
          ) : (
            <ConnectButton block label="Connect to resolve" />
          ))}
        {status}
      </div>
    );
  }

  if (bond.status === BondStatus.Completed) {
    return (
      <Callout tone="success" title="Bond completed">
        Both parties signed. A soulbound credential was minted to each wallet and the learner&apos;s
        stake was refunded.
      </Callout>
    );
  }

  if (!address) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-fg-muted">Connect the mentor or learner wallet to act on this bond.</p>
        <ConnectButton block />
      </div>
    );
  }

  if (!role) {
    return <Callout tone="info" title="View only">This wallet isn&apos;t a party to this bond.</Callout>;
  }

  if (bond.status === BondStatus.Pending) {
    if (!actions.accept) {
      return now >= Number(bond.deadline) ? (
        <Callout tone="info" title="Expired">The learner didn&apos;t accept before the deadline. This bond can no longer start.</Callout>
      ) : (
        <Callout tone="info" title="Waiting for the learner">
          The learner needs to accept and stake ETH before work begins. Share this page with them.
        </Callout>
      );
    }
    return (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!stakeError) tx.acceptBond(bond.id, stake);
        }}
      >
        <p className="text-sm text-fg-muted">
          Stake ETH to commit. It&apos;s held by the contract and refunded in full when both of you sign.
        </p>
        <Field id="stake" label="Your stake (ETH)" error={stake ? stakeError ?? undefined : undefined} hint={`Minimum ${MIN_STAKE_ETH} ETH`}>
          <Input
            id="stake"
            inputMode="decimal"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            invalid={!!stake && !!stakeError}
            className="font-mono"
          />
        </Field>
        <Button type="submit" className="w-full" loading={tx.isBusy} disabled={!!stakeError || tx.phase === "success"}>
          Accept &amp; stake {stakeError ? "" : `${stake} ETH`}
        </Button>
        {status}
      </form>
    );
  }

  // Active / MentorSigned / LearnerSigned
  return (
    <div className="space-y-4">
      {actions.awaitingCounterparty && (
        <Callout tone="success" title="You've signed">
          Waiting for the {role === "mentor" ? "learner" : "mentor"} to co-sign. Their signature completes the bond.
        </Callout>
      )}

      {actions.sign && (
        <>
          <p className="text-sm text-fg-muted">
            {role === "mentor"
              ? "Sign once the learner has met the success criteria."
              : "Sign once you've completed the work with your mentor."}{" "}
            {(bond.mentorSigned || bond.learnerSigned) && "Yours is the final signature — it mints both credentials."}
          </p>
          <Button className="w-full" icon={<Pen size={16} />} loading={tx.isBusy} disabled={tx.phase === "success"} onClick={() => tx.signCompletion(bond.id)}>
            Sign completion
          </Button>
        </>
      )}

      {actions.dispute && (
        <div className="space-y-3 border-t border-line pt-4">
          {!confirmDispute ? (
            <>
              <p className="text-sm text-fg-muted">
                The deadline has passed without both signatures. You can raise a dispute instead.
              </p>
              <Button variant="danger" className="w-full" icon={<Shield size={16} />} onClick={() => setConfirmDispute(true)} disabled={tx.isBusy}>
                Raise a dispute
              </Button>
            </>
          ) : (
            <>
              <Callout tone="danger" title="This can't be undone">
                A 7-day window opens. After it, the learner&apos;s stake is refunded and no credentials are minted.
              </Callout>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmDispute(false)} disabled={tx.isBusy}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" loading={tx.isBusy} onClick={() => tx.disputeBond(bond.id)}>
                  Confirm dispute
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {status}
    </div>
  );
}
