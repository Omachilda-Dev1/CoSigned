// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CoSigned
 * @notice Dual-signature mentorship Bond protocol.
 *         A mentor and learner co-sign a Bond on-chain.
 *         When both sign, soulbound NFTs are minted to each party.
 * @dev Day 5: Bond struct, BondStatus enum, storage mappings, events
 *      Day 6: createBond, acceptBond (added below)
 *      Day 7: signCompletion (added below)
 *      Day 8: disputeBond, resolveDispute (added below)
 *      Day 10: wire to CoSignedNFT
 */
contract CoSigned is ReentrancyGuard {

    // ─────────────────────────────────────────────────────────────────────────
    // ENUMS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice All possible states of a Bond.
     * @dev Terminal states: Completed, Disputed (after resolveDispute).
     */
    enum BondStatus {
        Pending,        // Created by mentor, awaiting learner acceptance
        Active,         // Learner accepted and staked ETH
        MentorSigned,   // Mentor signed, waiting on learner
        LearnerSigned,  // Learner signed, waiting on mentor
        Completed,      // Both signed — NFTs minted, stake refunded
        Disputed        // Deadline passed, dispute raised, 7-day window open
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STRUCTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Represents a single mentorship Bond between a mentor and learner.
     * @dev Gas note: uint256 fields each occupy a full 32-byte slot.
     *      address (20 bytes) + bool + bool = 22 bytes — fits in one slot.
     *      Struct ordering is optimised for clarity; gas optimisation is post-MVP.
     */
    struct Bond {
        uint256 id;                 // Auto-incremented bond ID (starts at 1)
        address mentor;             // Wallet that created the bond
        address learner;            // Wallet that accepted the bond
        string skillTitle;          // e.g. "React State Management"
        string successCriteria;     // e.g. "Build a working Zustand store"
        uint256 stakeAmount;        // ETH staked by learner in wei (0 until accepted)
        BondStatus status;          // Current lifecycle state
        uint256 deadline;           // Unix timestamp — bond must complete by this date
        string ipfsHash;            // IPFS CID of evidence/metadata JSON
        bool mentorSigned;          // Has mentor called signCompletion?
        bool learnerSigned;         // Has learner called signCompletion?
        uint256 disputeOpenedAt;    // Timestamp when dispute was raised (0 if none)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STATE VARIABLES
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Total number of bonds created. Also used as the next bond ID.
    uint256 public bondCounter;

    /// @notice All bonds by ID.
    mapping(uint256 => Bond) public bonds;

    /// @notice All bond IDs where a given address is the mentor.
    mapping(address => uint256[]) public mentorBonds;

    /// @notice All bond IDs where a given address is the learner.
    mapping(address => uint256[]) public learnerBonds;

    // ─────────────────────────────────────────────────────────────────────────
    // EVENTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Emitted when a mentor creates a new Bond.
     * @param bondId   The unique ID of the created bond.
     * @param mentor   Address of the mentor who created it.
     * @param learner  Address of the designated learner.
     * @param skillTitle  The skill being mentored.
     * @param deadline Unix timestamp deadline for the bond.
     */
    event BondCreated(
        uint256 indexed bondId,
        address indexed mentor,
        address indexed learner,
        string skillTitle,
        uint256 deadline
    );

    /**
     * @notice Emitted when a learner accepts a Bond and stakes ETH.
     * @param bondId      The bond that was accepted.
     * @param learner     Address of the learner.
     * @param stakeAmount Amount of ETH staked in wei.
     */
    event BondAccepted(
        uint256 indexed bondId,
        address indexed learner,
        uint256 stakeAmount
    );

    /**
     * @notice Emitted when either party signs completion.
     * @param bondId        The bond being signed.
     * @param signer        Address of the party who signed.
     * @param mentorSigned  Whether the mentor has signed.
     * @param learnerSigned Whether the learner has signed.
     */
    event BondSigned(
        uint256 indexed bondId,
        address indexed signer,
        bool mentorSigned,
        bool learnerSigned
    );

    /**
     * @notice Emitted when both parties have signed and the bond is complete.
     * @param bondId  The completed bond.
     * @param mentor  Address of the mentor.
     * @param learner Address of the learner.
     */
    event BondCompleted(
        uint256 indexed bondId,
        address indexed mentor,
        address indexed learner
    );

    /**
     * @notice Emitted when a dispute is raised after the deadline.
     * @param bondId          The disputed bond.
     * @param raisedBy        Address of the party who raised the dispute.
     * @param disputeOpenedAt Timestamp when the dispute was opened.
     */
    event BondDisputed(
        uint256 indexed bondId,
        address indexed raisedBy,
        uint256 disputeOpenedAt
    );

    /**
     * @notice Emitted when a dispute is resolved and stake is refunded.
     * @param bondId         The resolved bond.
     * @param resolvedBy     Address of the caller who triggered resolution.
     * @param refundedAmount Amount of ETH refunded to the learner in wei.
     */
    event DisputeResolved(
        uint256 indexed bondId,
        address indexed resolvedBy,
        uint256 refundedAmount
    );

    // ─────────────────────────────────────────────────────────────────────────
    // VIEW FUNCTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns the full Bond struct for a given bond ID.
     * @dev Returns a zero-value Bond if bondId doesn't exist.
     *      Frontend must check bond.id != 0 to confirm existence.
     * @param bondId The ID of the bond to retrieve.
     * @return The Bond struct.
     */
    function getBond(uint256 bondId) external view returns (Bond memory) {
        return bonds[bondId];
    }

    /**
     * @notice Returns all bond IDs associated with a given address (as mentor or learner).
     * @dev Concatenates mentorBonds and learnerBonds arrays.
     *      O(n) — acceptable for MVP. Use The Graph for scale.
     * @param user The wallet address to query.
     * @return Array of bond IDs.
     */
    function getBondsByAddress(address user) external view returns (uint256[] memory) {
        uint256[] memory mBonds = mentorBonds[user];
        uint256[] memory lBonds = learnerBonds[user];

        uint256 totalLen = mBonds.length + lBonds.length;
        uint256[] memory combined = new uint256[](totalLen);

        for (uint256 i = 0; i < mBonds.length; i++) {
            combined[i] = mBonds[i];
        }
        for (uint256 i = 0; i < lBonds.length; i++) {
            combined[mBonds.length + i] = lBonds[i];
        }

        return combined;
    }
}
