import type { Address } from "viem";

/** Mirrors `CoSigned.BondStatus` — order must match the Solidity enum. */
export enum BondStatus {
  Pending = 0,
  Active = 1,
  MentorSigned = 2,
  LearnerSigned = 3,
  Completed = 4,
  Disputed = 5,
}

/** Mirrors the `CoSigned.Bond` struct. */
export interface Bond {
  id: bigint;
  mentor: Address;
  learner: Address;
  skillTitle: string;
  successCriteria: string;
  stakeAmount: bigint;
  status: BondStatus;
  deadline: bigint;
  ipfsHash: string;
  mentorSigned: boolean;
  learnerSigned: boolean;
  disputeOpenedAt: bigint;
}

export type BondRole = "mentor" | "learner";

/** Off-chain metadata pinned to IPFS when a bond is created. */
export interface BondMetadata {
  name: string;
  description: string;
  external_url: string;
  attributes: { trait_type: string; value: string }[];
  properties?: {
    mentorName?: string;
    learnerName?: string;
  };
}
