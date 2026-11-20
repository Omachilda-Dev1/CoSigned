import type { Address } from "viem";
import { BondStatus, type Bond, type BondRole } from "@/types/bond";
import { DISPUTE_WINDOW_SECONDS } from "@/lib/config";
import { nowSeconds, sameAddress } from "@/lib/format";

export type StatusTone = "pending" | "active" | "signing" | "complete" | "disputed" | "muted";

export const STATUS_META: Record<BondStatus, { label: string; tone: StatusTone }> = {
  [BondStatus.Pending]: { label: "Pending", tone: "pending" },
  [BondStatus.Active]: { label: "Active", tone: "active" },
  [BondStatus.MentorSigned]: { label: "Mentor signed", tone: "signing" },
  [BondStatus.LearnerSigned]: { label: "Learner signed", tone: "signing" },
  [BondStatus.Completed]: { label: "Completed", tone: "complete" },
  [BondStatus.Disputed]: { label: "Disputed", tone: "disputed" },
};

/** Status label/tone, accounting for states the enum alone can't express. */
export function statusMeta(bond: Bond, now = nowSeconds()): { label: string; tone: StatusTone } {
  if (bond.status === BondStatus.Pending && now >= Number(bond.deadline)) {
    return { label: "Expired", tone: "muted" };
  }
  if (bond.status === BondStatus.Disputed && bond.stakeAmount === 0n) {
    return { label: "Resolved", tone: "muted" };
  }
  return STATUS_META[bond.status] ?? STATUS_META[BondStatus.Pending];
}

export function roleOf(bond: Bond, address?: Address): BondRole | null {
  if (sameAddress(bond.mentor, address)) return "mentor";
  if (sameAddress(bond.learner, address)) return "learner";
  return null;
}

export function isOpenForAcceptance(bond: Bond, now = nowSeconds()): boolean {
  return bond.status === BondStatus.Pending && now < Number(bond.deadline);
}

export function disputeResolvableAt(bond: Bond): number {
  return Number(bond.disputeOpenedAt) + DISPUTE_WINDOW_SECONDS;
}

/**
 * Every action the connected wallet can take right now. Mirrors the `require`
 * checks in CoSigned.sol so the UI never offers a transaction that would revert.
 */
export interface BondActions {
  accept: boolean;
  sign: boolean;
  dispute: boolean;
  resolve: boolean;
  /** Caller already signed and is waiting on the counterparty. */
  awaitingCounterparty: boolean;
}

export function availableActions(bond: Bond, address?: Address, now = nowSeconds()): BondActions {
  const role = roleOf(bond, address);
  const deadlinePassed = now > Number(bond.deadline);
  const signable =
    bond.status === BondStatus.Active ||
    bond.status === BondStatus.MentorSigned ||
    bond.status === BondStatus.LearnerSigned;
  const alreadySigned =
    (role === "mentor" && bond.mentorSigned) || (role === "learner" && bond.learnerSigned);

  return {
    // acceptBond: designated learner, Pending, before deadline
    accept: role === "learner" && bond.status === BondStatus.Pending && now < Number(bond.deadline),
    // signCompletion: either party, signable state, not yet signed (no deadline check on-chain)
    sign: role !== null && signable && !alreadySigned,
    // disputeBond: either party, strictly Active, after deadline
    dispute: role !== null && bond.status === BondStatus.Active && deadlinePassed,
    // resolveDispute: anyone, Disputed, window elapsed, stake not yet refunded
    resolve:
      bond.status === BondStatus.Disputed &&
      bond.stakeAmount > 0n &&
      now >= disputeResolvableAt(bond),
    awaitingCounterparty: role !== null && signable && alreadySigned,
  };
}

/** Timeline step index (0–3) for the progress tracker. */
export function progressStep(status: BondStatus): number {
  switch (status) {
    case BondStatus.Pending:
      return 0;
    case BondStatus.Active:
      return 1;
    case BondStatus.MentorSigned:
    case BondStatus.LearnerSigned:
    case BondStatus.Disputed:
      return 2;
    case BondStatus.Completed:
      return 3;
    default:
      return 0;
  }
}
