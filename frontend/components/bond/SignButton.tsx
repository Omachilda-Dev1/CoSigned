"use client";

import { useRouter } from "next/navigation";
import type { Bond } from "@/types/bond";
import { BondStatus } from "@/types/bond";
import {
  useAcceptBond,
  useSignCompletion,
  useDisputeBond,
  usePartyRole,
} from "@/hooks/useCoSigned";
import { formatEther } from "viem";

interface SignButtonProps {
  bond: Bond;
}

type ActionState = "accept" | "sign" | "dispute" | "view-nft" | "readonly" | "completed";

function getAction(bond: Bond, isMentor: boolean, isLearner: boolean): ActionState {
  if (!isMentor && !isLearner) return "readonly";

  switch (bond.status) {
    case BondStatus.Pending:
      return isLearner ? "accept" : "readonly";

    case BondStatus.Active:
    case BondStatus.MentorSigned:
    case BondStatus.LearnerSigned: {
      const alreadySigned = (isMentor && bond.mentorSigned) || (isLearner && bond.learnerSigned);
      if (alreadySigned) return "readonly";
      const deadlinePassed = Number(bond.deadline) < Math.floor(Date.now() / 1000);
      return deadlinePassed ? "dispute" : "sign";
    }

    case BondStatus.Completed:
      return "view-nft";

    case BondStatus.Disputed:
      return "readonly";

    default:
      return "readonly";
  }
}

function TxStatus({ isPending, isConfirming, isSuccess, error }: {
  isPending: boolean; isConfirming: boolean; isSuccess: boolean; error: Error | null;
}) {
  if (!isPending && !isConfirming && !isSuccess && !error) return null;

  const msg = isPending    ? "Waiting for wallet signature…"
    : isConfirming ? "Confirming on-chain…"
    : isSuccess    ? "Transaction confirmed!"
    : error        ? `Error: ${error.message.slice(0, 80)}`
    : "";

  const color = error ? "#FF4D6D" : isSuccess ? "#4DFFD2" : "#E8FF47";

  return (
    <div style={{
      marginTop: 12, padding: "10px 14px", borderRadius: 8,
      border: `1px solid ${color}30`,
      backgroundColor: `${color}08`,
    }}>
      <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color, margin: 0 }}>
        {msg}
      </p>
    </div>
  );
}

export default function SignButton({ bond }: SignButtonProps) {
  const router = useRouter();
  const { isMentor, isLearner } = usePartyRole(bond);
  const action = getAction(bond, isMentor, isLearner);

  const accept  = useAcceptBond();
  const sign    = useSignCompletion();
  const dispute = useDisputeBond();

  const isBusy = accept.isPending || accept.isConfirming
    || sign.isPending || sign.isConfirming
    || dispute.isPending || dispute.isConfirming;

  // ── Accept Bond ──────────────────────────────────────────────────────────
  if (action === "accept") {
    const stakeEth = bond.stakeAmount > 0n ? formatEther(bond.stakeAmount) : "0.01";
    return (
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A", marginBottom: 8 }}>
          Stake: {stakeEth} ETH (refunded on completion)
        </p>
        <button
          disabled={isBusy}
          onClick={() => accept.write?.(bond.id, stakeEth)}
          style={btnStyle("#4DFFD2", "#0A0A0F", isBusy)}
          onMouseEnter={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "#E8FF47"; }}
          onMouseLeave={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "#4DFFD2"; }}
          aria-label="Accept Bond and stake ETH"
        >
          {accept.isPending ? "Waiting for signature…" : accept.isConfirming ? "Confirming…" : "Accept Bond"}
        </button>
        <TxStatus {...accept} />
      </div>
    );
  }

  // ── Sign Completion ──────────────────────────────────────────────────────
  if (action === "sign") {
    return (
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#5A5A7A", marginBottom: 8 }}>
          {isMentor ? "Confirm the mentorship is complete." : "Confirm you've completed the learning."}
        </p>
        <button
          disabled={isBusy}
          onClick={() => sign.write?.(bond.id)}
          style={btnStyle("#4DFFD2", "#0A0A0F", isBusy)}
          onMouseEnter={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "#E8FF47"; }}
          onMouseLeave={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "#4DFFD2"; }}
          aria-label="Sign completion"
        >
          {sign.isPending ? "Waiting for signature…" : sign.isConfirming ? "Confirming…" : "Sign Completion"}
        </button>
        <TxStatus {...sign} />
      </div>
    );
  }

  // ── Raise Dispute ────────────────────────────────────────────────────────
  if (action === "dispute") {
    return (
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#FF4D6D", marginBottom: 8 }}>
          Deadline has passed. You can raise a dispute.
        </p>
        <button
          disabled={isBusy}
          onClick={() => dispute.write?.(bond.id)}
          style={btnStyle("transparent", "#FF4D6D", isBusy, "1px solid #FF4D6D")}
          onMouseEnter={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "rgba(255,77,109,0.1)"; }}
          onMouseLeave={e => { if (!isBusy) e.currentTarget.style.backgroundColor = "transparent"; }}
          aria-label="Raise dispute"
        >
          {dispute.isPending ? "Waiting for signature…" : dispute.isConfirming ? "Confirming…" : "Raise Dispute"}
        </button>
        <TxStatus {...dispute} />
      </div>
    );
  }

  // ── View NFT ─────────────────────────────────────────────────────────────
  if (action === "view-nft") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          padding: "12px 16px", borderRadius: 8,
          border: "1px solid rgba(77,255,210,0.3)",
          backgroundColor: "rgba(77,255,210,0.06)",
        }}>
          <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#4DFFD2", margin: 0 }}>
            Bond completed. Soulbound NFT minted to your wallet.
          </p>
        </div>
        <a
          href={`https://sepolia.basescan.org/address/0xC6Fce62038C0FD7f50c447a51C05492096554df5`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, fontWeight: 700,
            padding: "12px 24px", borderRadius: 10,
            border: "1px solid rgba(77,255,210,0.3)",
            color: "#4DFFD2", backgroundColor: "transparent",
            textDecoration: "none", textAlign: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(77,255,210,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          View NFT on BaseScan ↗
        </a>
      </div>
    );
  }

  // ── Already signed / read-only ───────────────────────────────────────────
  if (action === "readonly") {
    const alreadySigned = (isMentor && bond.mentorSigned) || (isLearner && bond.learnerSigned);
    if (alreadySigned) {
      return (
        <div style={{
          padding: "12px 16px", borderRadius: 8,
          border: "1px solid rgba(77,255,210,0.2)",
          backgroundColor: "rgba(77,255,210,0.04)",
        }}>
          <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "#4DFFD2", margin: 0 }}>
            You have signed. Waiting for the other party…
          </p>
        </div>
      );
    }
    return null;
  }

  return null;
}

function btnStyle(bg: string, color: string, disabled: boolean, border?: string): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px 24px",
    borderRadius: 10,
    border: border ?? "none",
    backgroundColor: disabled ? "rgba(255,255,255,0.06)" : bg,
    color: disabled ? "rgba(255,255,255,0.3)" : color,
    fontFamily: "var(--font-dm-mono, monospace)",
    fontWeight: 700, fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 200ms ease",
    minHeight: 44,
  };
}
