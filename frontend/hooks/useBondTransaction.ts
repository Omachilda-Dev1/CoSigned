"use client";

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther, type Address } from "viem";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { cosignedAbi } from "@/lib/abi";
import { chain, contracts } from "@/lib/config";
import { errorMessage } from "@/lib/format";

export type TxPhase = "idle" | "wallet" | "confirming" | "success" | "error";

export interface CreateBondArgs {
  learner: Address;
  skillTitle: string;
  successCriteria: string;
  deadline: bigint;
  ipfsHash: string;
}

const cosigned = { address: contracts.cosigned, abi: cosignedAbi, chainId: chain.id } as const;

/**
 * One CoSigned transaction lifecycle: wallet prompt → confirmation → success.
 * Switches the wallet to Base Sepolia if needed and refreshes all on-chain
 * reads once the transaction is mined.
 */
export function useBondTransaction() {
  const queryClient = useQueryClient();
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const write = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: write.data, chainId: chain.id });

  useEffect(() => {
    if (receipt.isSuccess) queryClient.invalidateQueries();
  }, [receipt.isSuccess, queryClient]);

  const ensureChain = useCallback(async () => {
    if (chainId !== chain.id) await switchChainAsync({ chainId: chain.id });
  }, [chainId, switchChainAsync]);

  const { writeContract, reset } = write;

  /** Clears the previous attempt and makes sure the wallet is on Base Sepolia. */
  const prepare = useCallback(async (): Promise<boolean> => {
    reset();
    try {
      await ensureChain();
      return true;
    } catch {
      return false; // user declined the network switch
    }
  }, [ensureChain, reset]);

  const createBond = async (a: CreateBondArgs) => {
    if (!(await prepare())) return;
    writeContract({
      ...cosigned,
      functionName: "createBond",
      args: [a.learner, a.skillTitle, a.successCriteria, a.deadline, a.ipfsHash],
    });
  };
  const acceptBond = async (bondId: bigint, stakeEth: string) => {
    if (!(await prepare())) return;
    writeContract({ ...cosigned, functionName: "acceptBond", args: [bondId], value: parseEther(stakeEth) });
  };
  const signCompletion = async (bondId: bigint) => {
    if (!(await prepare())) return;
    writeContract({ ...cosigned, functionName: "signCompletion", args: [bondId] });
  };
  const disputeBond = async (bondId: bigint) => {
    if (!(await prepare())) return;
    writeContract({ ...cosigned, functionName: "disputeBond", args: [bondId] });
  };
  const resolveDispute = async (bondId: bigint) => {
    if (!(await prepare())) return;
    writeContract({ ...cosigned, functionName: "resolveDispute", args: [bondId] });
  };

  const error = write.error ?? receipt.error;
  const phase: TxPhase = error
    ? "error"
    : write.isPending
      ? "wallet"
      : write.data && receipt.isLoading
        ? "confirming"
        : receipt.isSuccess
          ? "success"
          : "idle";

  return {
    createBond,
    acceptBond,
    signCompletion,
    disputeBond,
    resolveDispute,
    reset,
    phase,
    isBusy: phase === "wallet" || phase === "confirming",
    hash: write.data,
    receipt: receipt.data,
    error: error ? errorMessage(error) : null,
  };
}
