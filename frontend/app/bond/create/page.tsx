"use client";

import { useState } from "react";
import CertificateCard from "@/components/nft/CertificateCard";

interface FormState {
  learnerAddress: string;
  learnerName: string;
  skillTitle: string;
  successCriteria: string;
  deadline: string;
  mentorName: string;
}

const MUTED = "#5A5A7A";
const TEAL = "#4DFFD2";
const BORDER = "rgba(77,255,210,0.15)";

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  rows,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: "#F0F0F5",
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: 13,
    outline: "none",
    resize: rows ? "vertical" : undefined,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}
      >
        {label}{required && <span style={{ color: TEAL }}> *</span>}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          aria-label={label}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          aria-label={label}
        />
      )}
    </div>
  );
}

export default function CreateBondPage() {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<FormState>({
    learnerAddress: "",
    learnerName: "",
    skillTitle: "",
    successCriteria: "",
    deadline: "",
    mentorName: "",
  });

  const set = (key: keyof FormState) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }));

  return (
    <main
      style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F0F0F5", padding: "40px 24px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Page title */}
        <h1 style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 700, fontSize: 28, marginBottom: 8 }}>
          Create a Bond
        </h1>
        <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: MUTED, marginBottom: 40 }}>
          Define the skill, criteria, and deadline. The learner accepts and stakes ETH.
        </p>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

          {/* ── LEFT: Form ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Your display name (Mentor)" id="mentorName" value={form.mentorName} onChange={set("mentorName")} placeholder="e.g. Chioma" required />
            <Field label="Learner wallet address" id="learnerAddress" value={form.learnerAddress} onChange={set("learnerAddress")} placeholder="0x..." required />
            <Field label="Learner display name" id="learnerName" value={form.learnerName} onChange={set("learnerName")} placeholder="e.g. Alex" />
            <Field label="Skill title" id="skillTitle" value={form.skillTitle} onChange={set("skillTitle")} placeholder="e.g. React State Management" required />
            <Field label="Success criteria" id="successCriteria" value={form.successCriteria} onChange={set("successCriteria")} placeholder="What does completion look like?" rows={3} required />
            <Field label="Deadline" id="deadline" type="date" value={form.deadline} onChange={set("deadline")} required />

            <button
              style={{
                marginTop: 8,
                padding: "12px 24px",
                background: TEAL,
                color: "#0A0A0F",
                border: "none",
                borderRadius: 8,
                fontFamily: "var(--font-dm-mono, monospace)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                width: "100%",
              }}
              aria-label="Create bond on-chain"
            >
              Create Bond On-Chain
            </button>
          </div>

          {/* ── RIGHT: Certificate preview ── */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Certificate Preview
            </div>
            <CertificateCard
              learnerName={form.learnerName}
              mentorName={form.mentorName}
              skillTitle={form.skillTitle}
              successCriteria={form.successCriteria}
              startDate={today}
              completedDate=""
              bondId={undefined}
              tokenType="LEARNER_PROOF"
              status="preview"
              animated={false}
            />
            <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "#3A3A5A", marginTop: 10, textAlign: "center" }}>
              This is how your credential will appear on-chain
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
