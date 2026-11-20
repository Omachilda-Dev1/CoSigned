import type { TxPhase } from "@/hooks/useBondTransaction";
import { explorerUrl } from "@/lib/config";
import { Callout } from "@/components/ui/primitives";

const COPY: Partial<Record<TxPhase, { tone: "info" | "success" | "danger"; title: string }>> = {
  wallet: { tone: "info", title: "Confirm the transaction in your wallet…" },
  confirming: { tone: "info", title: "Transaction submitted — waiting for confirmation…" },
  success: { tone: "success", title: "Transaction confirmed." },
  error: { tone: "danger", title: "Transaction failed" },
};

export function TxStatus({
  phase,
  hash,
  error,
  successMessage,
}: {
  phase: TxPhase;
  hash?: string;
  error?: string | null;
  successMessage?: string;
}) {
  const copy = COPY[phase];
  if (!copy) return null;
  return (
    <Callout tone={copy.tone} title={phase === "success" && successMessage ? successMessage : copy.title}>
      {phase === "error" && error}
      {hash && phase !== "error" && (
        <a href={explorerUrl.tx(hash)} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          View on BaseScan
        </a>
      )}
    </Callout>
  );
}
