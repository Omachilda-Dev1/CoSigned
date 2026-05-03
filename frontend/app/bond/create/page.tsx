"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAccount } from "wagmi";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ConnectButton from "@/components/wallet/ConnectButton";
import CertificateCard from "@/components/nft/CertificateCard";
import { useCreateBond } from "@/hooks/useCoSigned";
import { uploadBondMetadata, buildBondMetadata } from "@/lib/pinata";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const isEthAddress = (v: string) => /^0x[0-9a-fA-F]{40}$/.test(v);

const schema = z.object({
  learnerAddress: z
    .string()
    .min(1, "Learner address is required")
    .refine(isEthAddress, "Must be a valid Ethereum address (0x...)"),
  learnerName: z.string().optional(),
  skillTitle: z
    .string()
    .min(3, "Skill title must be at least 3 characters")
    .max(100, "Skill title too long"),
  successCriteria: z
    .string()
    .min(10, "Please describe what completion looks like (min 10 chars)")
    .max(500, "Success criteria too long"),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine(v => new Date(v) > new Date(), "Deadline must be in the future"),
  mentorName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label, id, type = "text", placeholder, rows, required, error,
  register,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  rows?: number; required?: boolean; error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--bg-card)",
    border: `1px solid ${error ? "#EF4444" : "var(--border)"}`,
    borderRadius: 8,
    padding: "11px 14px",
    color: "var(--text)",
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: 13,
    outline: "none",
    resize: rows ? "vertical" : undefined,
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-dm-mono, monospace)",
          fontSize: 10, color: "var(--text-muted)",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}
      >
        {label}{required && <span style={{ color: "var(--accent)" }}> *</span>}
      </label>

      {rows ? (
        <textarea id={id} rows={rows} placeholder={placeholder} style={inputStyle} {...register} />
      ) : (
        <input id={id} type={type} placeholder={placeholder} style={inputStyle} {...register} />
      )}

      {error && (
        <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "#EF4444" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Transaction status banner ────────────────────────────────────────────────

function TxBanner({ state, txHash }: { state: "uploading" | "pending" | "confirming" | "success" | "error"; txHash?: string; }) {
  const configs = {
    uploading:  { bg: "rgba(77,255,210,0.08)",  border: "var(--accent)",  text: "Uploading metadata to IPFS…" },
    pending:    { bg: "rgba(77,255,210,0.08)",  border: "var(--accent)",  text: "Waiting for wallet signature…" },
    confirming: { bg: "rgba(200,255,77,0.08)",  border: "var(--accent-2)", text: "Transaction submitted — waiting for confirmation…" },
    success:    { bg: "rgba(77,255,210,0.12)",  border: "var(--accent)",  text: "Bond created successfully!" },
    error:      { bg: "rgba(239,68,68,0.08)",   border: "#EF4444",        text: "Transaction failed. Please try again." },
  };
  const c = configs[state];

  return (
    <div style={{
      padding: "12px 16px", borderRadius: 8,
      border: `1px solid ${c.border}`,
      backgroundColor: c.bg,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    }}>
      <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "var(--text)" }}>
        {c.text}
      </span>
      {txHash && (
        <a
          href={`https://sepolia.basescan.org/tx/${txHash}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "var(--accent)", whiteSpace: "nowrap" }}
        >
          View TX ↗
        </a>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateBondPage() {
  const router = useRouter();
  const { address } = useAccount();
  const today = new Date().toISOString().split("T")[0];

  const { write, isPending, isConfirming, isSuccess, error, txHash } = useCreateBond();

  const [txState, setTxState] = useState<"idle" | "uploading" | "pending" | "confirming" | "success" | "error">("idle");
  const [newBondId, setNewBondId] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Watch form values for live certificate preview
  const watched = watch();

  // Sync transaction state
  useEffect(() => {
    if (isPending)    setTxState("pending");
    if (isConfirming) setTxState("confirming");
    if (isSuccess)    setTxState("success");
    if (error)        setTxState("error");
  }, [isPending, isConfirming, isSuccess, error]);

  // Redirect to bond detail on success
  useEffect(() => {
    if (isSuccess && newBondId) {
      const timer = setTimeout(() => router.push(`/bond/${newBondId}`), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, newBondId, router]);

  const onSubmit = async (values: FormValues) => {
    if (!write) return;

    try {
      // 1. Upload metadata to IPFS
      setTxState("uploading");
      const metadata = buildBondMetadata({
        skillTitle:      values.skillTitle,
        successCriteria: values.successCriteria,
        mentorAddress:   address ?? "0x0000000000000000000000000000000000000000",
        learnerAddress:  values.learnerAddress,
        deadline:        values.deadline,
      });
      const ipfsHash = await uploadBondMetadata(metadata);

      // 2. Call contract
      const deadlineTs = BigInt(Math.floor(new Date(values.deadline).getTime() / 1000));
      write({
        learner:          values.learnerAddress as `0x${string}`,
        skillTitle:       values.skillTitle,
        successCriteria:  values.successCriteria,
        deadline:         deadlineTs,
        ipfsHash,
      });
    } catch {
      setTxState("error");
    }
  };

  const isBusy = txState === "uploading" || txState === "pending" || txState === "confirming";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text)" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 40px", maxWidth: 1280, margin: "0 auto",
        }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}>
            <Logo width={156} height={40} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 12, color: "var(--text-muted)" }}>Dashboard</span>
          </button>
          <h1 style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 800, fontSize: 32, color: "var(--text)", letterSpacing: "-0.025em", marginBottom: 8 }}>
            Create a Bond
          </h1>
          <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 13, color: "var(--text-muted)" }}>
            Define the skill, success criteria, and deadline. The learner accepts and stakes ETH.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

          {/* ── LEFT: Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 22 }}>

            <Field label="Learner wallet address" id="learnerAddress" placeholder="0x..." required error={errors.learnerAddress?.message} register={register("learnerAddress")} />
            <Field label="Learner display name" id="learnerName" placeholder="e.g. Alex (optional)" error={errors.learnerName?.message} register={register("learnerName")} />
            <Field label="Skill title" id="skillTitle" placeholder="e.g. React State Management" required error={errors.skillTitle?.message} register={register("skillTitle")} />
            <Field label="Success criteria" id="successCriteria" placeholder="What does completion look like? Be specific." rows={4} required error={errors.successCriteria?.message} register={register("successCriteria")} />
            <Field label="Deadline" id="deadline" type="date" required error={errors.deadline?.message} register={register("deadline")} />

            {/* Transaction status */}
            {txState !== "idle" && (
              <TxBanner state={txState} txHash={txHash} />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy || !address}
              style={{
                marginTop: 4,
                padding: "14px 24px",
                backgroundColor: isBusy ? "var(--border)" : "var(--accent)",
                color: isBusy ? "var(--text-muted)" : "#080808",
                border: "none",
                borderRadius: 10,
                fontFamily: "var(--font-dm-mono, monospace)",
                fontWeight: 700,
                fontSize: 14,
                cursor: isBusy || !address ? "not-allowed" : "pointer",
                width: "100%",
                transition: "opacity 0.15s, background-color 0.15s",
                opacity: isBusy ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!isBusy && address) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              {txState === "uploading"  ? "Uploading to IPFS…"
               : txState === "pending"    ? "Waiting for signature…"
               : txState === "confirming" ? "Confirming…"
               : txState === "success"    ? "Bond Created!"
               : !address                 ? "Connect wallet to continue"
               : "Create Bond On-Chain"}
            </button>

            {!address && (
              <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
                You need to connect your wallet before creating a bond.
              </p>
            )}
          </form>

          {/* ── RIGHT: Certificate preview ── */}
          <div style={{ position: "sticky", top: 88 }}>
            <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              Certificate Preview
            </p>
            <CertificateCard
              learnerName={watched.learnerName ?? ""}
              mentorName={watched.mentorName ?? ""}
              skillTitle={watched.skillTitle ?? ""}
              successCriteria={watched.successCriteria ?? ""}
              startDate={today}
              completedDate=""
              bondId={undefined}
              tokenType="LEARNER_PROOF"
              status="preview"
              animated={false}
            />
            <p style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 10, color: "var(--text-muted)", marginTop: 10, textAlign: "center" }}>
              This is how the credential will appear on-chain
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg)" }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "20px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo variant="icon" width={22} height={22} />
            <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "var(--text-muted)" }}>
              CoSigned — Your skills. Witnessed on-chain.
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-mono, monospace)", fontSize: 11, color: "var(--text-muted)" }}>
            Base Sepolia · Chain 84532
          </span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        input:focus, textarea:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px rgba(77,255,210,0.1);
        }
      `}</style>
    </div>
  );
}
