"use client";

import { BondStatus } from "@/types/bond";

interface BondTimelineProps {
  status: BondStatus;
  mentorSigned: boolean;
  learnerSigned: boolean;
}

const STEPS = [
  { key: "created",   label: "Created",         desc: "Bond defined on-chain" },
  { key: "accepted",  label: "Accepted",         desc: "Learner staked ETH" },
  { key: "signed",    label: "Co-Signing",       desc: "Both parties sign" },
  { key: "completed", label: "Completed",        desc: "NFTs minted" },
];

function stepIndex(status: BondStatus): number {
  switch (status) {
    case BondStatus.Pending:       return 0;
    case BondStatus.Active:        return 1;
    case BondStatus.MentorSigned:
    case BondStatus.LearnerSigned: return 2;
    case BondStatus.Completed:     return 3;
    case BondStatus.Disputed:      return 2; // stuck at signing
    default:                       return 0;
  }
}

export default function BondTimeline({ status, mentorSigned, learnerSigned }: BondTimelineProps) {
  const active = stepIndex(status);
  const isDisputed = status === BondStatus.Disputed;

  return (
    <div style={{ width: "100%" }}>
      {/* Step track */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STEPS.map((step, i) => {
          const done    = i < active || status === BondStatus.Completed;
          const current = i === active && status !== BondStatus.Completed;
          const disputed = isDisputed && i === 2;

          const dotColor = disputed ? "#FF4D6D"
            : done ? "#4DFFD2"
            : current ? "#E8FF47"
            : "rgba(255,255,255,0.12)";

          const lineColor = i < active ? "#4DFFD2" : "rgba(255,255,255,0.08)";

          return (
            <div key={step.key} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              {/* Dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  backgroundColor: done ? "#4DFFD2" : disputed ? "rgba(255,77,109,0.15)" : current ? "rgba(232,255,71,0.12)" : "rgba(255,255,255,0.04)",
                  border: `2px solid ${dotColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: (done || current) && !disputed ? `0 0 12px ${dotColor}40` : "none",
                  transition: "all 0.3s ease",
                }}>
                  {done && status !== BondStatus.Completed ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : status === BondStatus.Completed && i === 3 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : disputed ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF4D6D" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 9v4M12 17h.01"/>
                    </svg>
                  ) : (
                    <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: current ? "#E8FF47" : "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <p style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: 10, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    color: disputed && i === 2 ? "#FF4D6D" : done ? "#4DFFD2" : current ? "#E8FF47" : "rgba(255,255,255,0.3)",
                    margin: 0,
                  }}>
                    {disputed && i === 2 ? "Disputed" : step.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 9, color: "rgba(255,255,255,0.2)", margin: "2px 0 0" }}>
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 40,
                  backgroundColor: lineColor,
                  transition: "background-color 0.3s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Signing indicators — shown during Active/MentorSigned/LearnerSigned */}
      {(status === BondStatus.Active || status === BondStatus.MentorSigned || status === BondStatus.LearnerSigned) && (
        <div style={{
          marginTop: 24, padding: "14px 20px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(255,255,255,0.02)",
          display: "flex", gap: 24,
        }}>
          <SignIndicator label="Mentor" signed={mentorSigned} />
          <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
          <SignIndicator label="Learner" signed={learnerSigned} />
        </div>
      )}
    </div>
  );
}

function SignIndicator({ label, signed }: { label: string; signed: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        backgroundColor: signed ? "rgba(77,255,210,0.15)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${signed ? "#4DFFD2" : "rgba(255,255,255,0.12)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {signed && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4DFFD2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", margin: 0 }}>
          {label}
        </p>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: signed ? "#4DFFD2" : "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>
          {signed ? "Signed" : "Pending…"}
        </p>
      </div>
    </div>
  );
}
