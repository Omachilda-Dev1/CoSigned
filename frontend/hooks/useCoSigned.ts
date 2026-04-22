"use client";

/**
 * useCoSigned — contract interaction hooks
 * All contract reads and writes go through here.
 * Pages never call wagmi directly — they use these hooks.
 *
 * Write hooks return: { write, isPending, isConfirming, isSuccess, error }
 * Read hooks return:  { data, isLoading, error }
 */

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { parseEther } from "viem";
import { COSIGNED_ADDRESS, COSIGNED_ABI } from "@/lib/contract";
import type { Bond } from "@/types/bond";
import { BondStatus } from "@/types/bond";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WriteHookResult {
  write: ((...args: unknown[]) => void) | undefined;
  isPending: boolean;    // waiting for wallet signature
  isConfirming: boolean; // tx submitted, waiting for block
  isSuccess: boolean;    // tx confirmed
  error: Error | null;
  txHash: `0x${string}` | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps raw tuple from contract into a typed Bond object.
 * The ABI returns a tuple array; wagmi decodes it as an object with named keys.
 */
function mapBond(raw: unknown): Bond | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!r.id && r.id !== 0n) return null;
  return {
    id:              r.id              as bigint,
    mentor:          r.mentor          as `0x${string}`,
    learner:         r.learner         as `0x${string}`,
    skillTitle:      r.skillTitle      as string,
    successCriteria: r.successCriteria as string,
    stakeAmount:     r.stakeAmount     as bigint,
    status:          Number(r.status)  as BondStatus,
    deadline:        r.deadline        as bigint,
    ipfsHash:        r.ipfsHash        as string,
    mentorSigned:    r.mentorSigned    as boolean,
    learnerSigned:   r.learnerSigned   as boolean,
    disputeOpenedAt: r.disputeOpenedAt as bigint,
  };
}

// ─── Write: createBond ────────────────────────────────────────────────────────

export interface CreateBondArgs {
  learner: `0x${string}`;
  skillTitle: string;
  successCriteria: string;
  deadline: bigint;       // unix timestamp
  ipfsHash: string;
}

export function useCreateBond(): WriteHookResult & {
  write: ((args: CreateBondArgs) => void) | undefined;
} {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const write = writeContract
    ? (args: CreateBondArgs) =>
        writeContract({
          address: COSIGNED_ADDRESS,
          abi: COSIGNED_ABI,
          functionName: "createBond",
          args: [
            args.learner,
            args.skillTitle,
            args.successCriteria,
            args.deadline,
            args.ipfsHash,
          ],
        })
    : undefined;

  return { write, isPending, isConfirming, isSuccess, error, txHash };
}

// ─── Write: acceptBond ────────────────────────────────────────────────────────

export function useAcceptBond(): WriteHookResult & {
  write: ((bondId: bigint, stakeEth: string) => void) | undefined;
} {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const write = writeContract
    ? (bondId: bigint, stakeEth: string) =>
        writeContract({
          address: COSIGNED_ADDRESS,
          abi: COSIGNED_ABI,
          functionName: "acceptBond",
          args: [bondId],
          value: parseEther(stakeEth),
        })
    : undefined;

  return { write, isPending, isConfirming, isSuccess, error, txHash };
}

// ─── Write: signCompletion ────────────────────────────────────────────────────

export function useSignCompletion(): WriteHookResult & {
  write: ((bondId: bigint) => void) | undefined;
} {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const write = writeContract
    ? (bondId: bigint) =>
        writeContract({
          address: COSIGNED_ADDRESS,
          abi: COSIGNED_ABI,
          functionName: "signCompletion",
          args: [bondId],
        })
    : undefined;

  return { write, isPending, isConfirming, isSuccess, error, txHash };
}

// ─── Write: disputeBond ───────────────────────────────────────────────────────

export function useDisputeBond(): WriteHookResult & {
  write: ((bondId: bigint) => void) | undefined;
} {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const write = writeContract
    ? (bondId: bigint) =>
        writeContract({
          address: COSIGNED_ADDRESS,
          abi: COSIGNED_ABI,
          functionName: "disputeBond",
          args: [bondId],
        })
    : undefined;

  return { write, isPending, isConfirming, isSuccess, error, txHash };
}

// ─── Write: resolveDispute ────────────────────────────────────────────────────

export function useResolveDispute(): WriteHookResult & {
  write: ((bondId: bigint) => void) | undefined;
} {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const write = writeContract
    ? (bondId: bigint) =>
        writeContract({
          address: COSIGNED_ADDRESS,
          abi: COSIGNED_ABI,
          functionName: "resolveDispute",
          args: [bondId],
        })
    : undefined;

  return { write, isPending, isConfirming, isSuccess, error, txHash };
}

// ─── Read: useBond ────────────────────────────────────────────────────────────

export function useBond(bondId: bigint | undefined): {
  bond: Bond | null;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useReadContract({
    address: COSIGNED_ADDRESS,
    abi: COSIGNED_ABI,
    functionName: "getBond",
    args: bondId !== undefined ? [bondId] : undefined,
    query: { enabled: bondId !== undefined },
  });

  return {
    bond: data ? mapBond(data) : null,
    isLoading,
    error: error as Error | null,
  };
}

// ─── Read: useUserBonds ───────────────────────────────────────────────────────

export function useUserBonds(address: `0x${string}` | undefined): {
  bondIds: bigint[];
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useReadContract({
    address: COSIGNED_ADDRESS,
    abi: COSIGNED_ABI,
    functionName: "getBondsByAddress",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    bondIds: (data as bigint[] | undefined) ?? [],
    isLoading,
    error: error as Error | null,
  };
}

// ─── Read: useBondCounter ─────────────────────────────────────────────────────

export function useBondCounter(): {
  count: bigint;
  isLoading: boolean;
} {
  const { data, isLoading } = useReadContract({
    address: COSIGNED_ADDRESS,
    abi: COSIGNED_ABI,
    functionName: "bondCounter",
  });

  return {
    count: (data as bigint | undefined) ?? 0n,
    isLoading,
  };
}

// ─── Utility: useConnectedAddress ─────────────────────────────────────────────

export function useConnectedAddress(): `0x${string}` | undefined {
  const { address } = useAccount();
  return address;
}

// ─── Utility: isMentor / isLearner ────────────────────────────────────────────

export function usePartyRole(bond: Bond | null): {
  isMentor: boolean;
  isLearner: boolean;
  isParty: boolean;
} {
  const address = useConnectedAddress();
  if (!bond || !address) return { isMentor: false, isLearner: false, isParty: false };
  const isMentor  = bond.mentor.toLowerCase()  === address.toLowerCase();
  const isLearner = bond.learner.toLowerCase() === address.toLowerCase();
  return { isMentor, isLearner, isParty: isMentor || isLearner };
}

// ─── Re-export BondStatus for convenience ─────────────────────────────────────
export { BondStatus };
