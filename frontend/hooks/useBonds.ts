"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { cosignedAbi } from "@/lib/abi";
import { contracts } from "@/lib/config";
import { gatewayUrl } from "@/lib/ipfs";
import type { Bond, BondMetadata, BondStatus } from "@/types/bond";

const cosigned = { address: contracts.cosigned, abi: cosignedAbi } as const;

type RawBond = Omit<Bond, "status"> & { status: number };

function toBond(raw: RawBond | undefined): Bond | null {
  if (!raw || raw.id === 0n) return null; // contract returns a zeroed struct for unknown IDs
  return { ...raw, status: raw.status as BondStatus };
}

/** Total bonds ever created (IDs run 1..count). */
export function useBondCount() {
  const query = useReadContract({ ...cosigned, functionName: "bondCounter" });
  return { ...query, count: query.data ?? 0n };
}

export function useBond(bondId: bigint | undefined) {
  const query = useReadContract({
    ...cosigned,
    functionName: "getBond",
    args: bondId !== undefined ? [bondId] : undefined,
    query: { enabled: bondId !== undefined && bondId > 0n },
  });
  return { ...query, bond: toBond(query.data as RawBond | undefined) };
}

/** Loads many bonds in a single multicall. */
export function useBondsById(ids: readonly bigint[]) {
  const query = useReadContracts({
    contracts: ids.map((id) => ({ ...cosigned, functionName: "getBond", args: [id] }) as const),
    query: { enabled: ids.length > 0 },
  });

  const bonds = useMemo(
    () =>
      (query.data ?? [])
        .map((r) => (r.status === "success" ? toBond(r.result as RawBond) : null))
        .filter((b): b is Bond => b !== null),
    [query.data],
  );

  return { ...query, bonds, isLoading: ids.length > 0 && query.isLoading };
}

/** Every bond where `address` is mentor or learner, newest first. */
export function useBondsForAddress(address: Address | undefined) {
  const idsQuery = useReadContract({
    ...cosigned,
    functionName: "getBondsByAddress",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const ids = useMemo(() => {
    const unique = Array.from(new Set((idsQuery.data ?? []).map(String))).map(BigInt);
    return unique.sort((a, b) => (a > b ? -1 : 1));
  }, [idsQuery.data]);

  const bondsQuery = useBondsById(ids);

  return {
    bonds: bondsQuery.bonds,
    isLoading: idsQuery.isLoading || bondsQuery.isLoading,
    error: idsQuery.error ?? bondsQuery.error,
  };
}

/** Every bond on the protocol. Fine at testnet scale; swap for an indexer later. */
export function useAllBonds() {
  const { count, isLoading: countLoading, error: countError } = useBondCount();
  const ids = useMemo(
    () => Array.from({ length: Number(count) }, (_, i) => BigInt(i + 1)),
    [count],
  );
  const bondsQuery = useBondsById(ids);
  return {
    count,
    bonds: bondsQuery.bonds,
    isLoading: countLoading || bondsQuery.isLoading,
    error: countError ?? bondsQuery.error,
  };
}

/** Off-chain metadata (display names etc.) pinned when the bond was created. */
export function useBondMetadata(ipfsHash: string | undefined) {
  const url = ipfsHash ? gatewayUrl(ipfsHash) : null;
  return useQuery({
    queryKey: ["bond-metadata", url],
    enabled: !!url,
    staleTime: Infinity,
    retry: 1,
    queryFn: async (): Promise<BondMetadata | null> => {
      const res = await fetch(url!);
      if (!res.ok) return null;
      return (await res.json()) as BondMetadata;
    },
  });
}
