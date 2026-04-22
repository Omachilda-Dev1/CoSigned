// Bond types — matching CoSigned.sol Bond struct exactly

export enum BondStatus {
  Pending = 0,
  Active = 1,
  MentorSigned = 2,
  LearnerSigned = 3,
  Completed = 4,
  Disputed = 5,
}

export interface Bond {
  id: bigint;
  mentor: `0x${string}`;
  learner: `0x${string}`;
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
