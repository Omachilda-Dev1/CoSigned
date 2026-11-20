"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAddress, parseEventLogs, type Address } from "viem";
import { cosignedAbi } from "@/lib/abi";
import { buildBondMetadata, pinBondMetadata } from "@/lib/ipfs";
import { dateInputValue, endOfDayTimestamp, sameAddress } from "@/lib/format";
import { useBondTransaction } from "@/hooks/useBondTransaction";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { ArrowLeft } from "@/components/ui/icons";
import { Callout, PageHeader } from "@/components/ui/primitives";
import { TxStatus } from "@/components/bond/TxStatus";
import { Certificate } from "@/components/credential/Certificate";
import { WalletGuard } from "@/components/wallet/WalletGuard";

const schema = z.object({
  learner: z
    .string()
    .trim()
    .min(1, "Enter the learner's wallet address.")
    .refine((v): boolean => isAddress(v), "That isn't a valid Ethereum address."),
  skillTitle: z.string().trim().min(3, "At least 3 characters.").max(80, "Keep it under 80 characters."),
  successCriteria: z
    .string()
    .trim()
    .min(20, "Describe what done looks like — at least 20 characters.")
    .max(500, "Keep it under 500 characters."),
  deadline: z
    .string()
    .min(1, "Pick a deadline.")
    .refine((v) => v >= dateInputValue(0), "The deadline must be today or later."),
  mentorName: z.string().trim().max(40, "Keep it under 40 characters.").optional(),
  learnerName: z.string().trim().max(40, "Keep it under 40 characters.").optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateBondForm() {
  return (
    <WalletGuard title="Connect to create a bond" body="Bonds are created from the mentor's wallet.">
      {(address) => <Form mentor={address} />}
    </WalletGuard>
  );
}

function Form({ mentor }: { mentor: Address }) {
  const router = useRouter();
  const tx = useBondTransaction();
  const [pinning, setPinning] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deadline: dateInputValue(30) },
    mode: "onTouched",
  });

  // Once mined, read the new bond ID from the BondCreated event and go to it.
  useEffect(() => {
    if (!tx.receipt) return;
    const [created] = parseEventLogs({ abi: cosignedAbi, eventName: "BondCreated", logs: tx.receipt.logs });
    if (created) router.push(`/bond/${created.args.bondId}`);
  }, [tx.receipt, router]);

  const onSubmit = async (values: FormValues) => {
    if (sameAddress(values.learner, mentor)) {
      setError("learner", { message: "You can't mentor yourself — use the learner's wallet." });
      return;
    }
    setPinError(null);
    setPinning(true);
    let ipfsHash: string;
    try {
      ipfsHash = await pinBondMetadata(
        buildBondMetadata({ ...values, mentor, deadline: values.deadline }),
      );
    } catch (e) {
      setPinError(e instanceof Error ? e.message : "Couldn't upload metadata.");
      return;
    } finally {
      setPinning(false);
    }

    tx.createBond({
      learner: values.learner as Address,
      skillTitle: values.skillTitle,
      successCriteria: values.successCriteria,
      deadline: endOfDayTimestamp(values.deadline),
      ipfsHash,
    });
  };

  const busy = pinning || tx.isBusy || tx.phase === "success";
  const preview = watch();

  return (
    <div className="container py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
        <ArrowLeft size={15} /> Dashboard
      </Link>
      <div className="mt-6">
        <PageHeader
          eyebrow="New bond"
          title="Create a bond"
          description="Define the skill and what success looks like. Your learner accepts by staking ETH, and when you both sign, each of you receives a soulbound credential."
        />
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <fieldset className="space-y-5" disabled={busy}>
            <legend className="eyebrow mb-4">The skill</legend>
            <Field id="skillTitle" label="Skill title" error={errors.skillTitle?.message} hint="e.g. React state management">
              <Input id="skillTitle" placeholder="What are you teaching?" invalid={!!errors.skillTitle} {...register("skillTitle")} />
            </Field>
            <Field
              id="successCriteria"
              label="Success criteria"
              error={errors.successCriteria?.message}
              hint="Be specific — both of you sign against this."
            >
              <Textarea
                id="successCriteria"
                placeholder="e.g. Ship a todo app with a persisted Zustand store and tests for each action."
                invalid={!!errors.successCriteria}
                {...register("successCriteria")}
              />
            </Field>
            <Field id="deadline" label="Deadline" error={errors.deadline?.message} hint="The learner must accept before this date.">
              <Input id="deadline" type="date" min={dateInputValue(0)} invalid={!!errors.deadline} {...register("deadline")} />
            </Field>
          </fieldset>

          <fieldset className="space-y-5 border-t border-line pt-6" disabled={busy}>
            <legend className="eyebrow mb-4">The people</legend>
            <Field id="learner" label="Learner wallet address" error={errors.learner?.message}>
              <Input id="learner" placeholder="0x…" autoComplete="off" spellCheck={false} className="font-mono" invalid={!!errors.learner} {...register("learner")} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="learnerName" label="Learner name" optional error={errors.learnerName?.message}>
                <Input id="learnerName" placeholder="Shown on the credential" invalid={!!errors.learnerName} {...register("learnerName")} />
              </Field>
              <Field id="mentorName" label="Your name" optional error={errors.mentorName?.message}>
                <Input id="mentorName" placeholder="Shown on the credential" invalid={!!errors.mentorName} {...register("mentorName")} />
              </Field>
            </div>
          </fieldset>

          <div className="space-y-3 border-t border-line pt-6">
            {pinError && <Callout tone="danger" title="Metadata upload failed">{pinError}</Callout>}
            {pinning && <Callout tone="info" title="Uploading metadata to IPFS…" />}
            <TxStatus phase={tx.phase} hash={tx.hash} error={tx.error} successMessage="Bond created — opening it now…" />
            <Button type="submit" size="lg" className="w-full" loading={busy && tx.phase !== "success"} disabled={busy}>
              Create bond on-chain
            </Button>
            <p className="text-center text-xs text-fg-subtle">You only pay gas. The learner sets their stake when accepting.</p>
          </div>
        </form>

        <div className="space-y-3 lg:sticky lg:top-24">
          <p className="eyebrow">Live preview</p>
          <Certificate
            state="preview"
            skillTitle={preview.skillTitle ?? ""}
            learnerName={preview.learnerName}
            mentorName={preview.mentorName}
            learner={isAddress(preview.learner ?? "") ? preview.learner : undefined}
            mentor={mentor}
          />
          <p className="text-xs text-fg-subtle">The credential both of you receive once the bond is co-signed.</p>
        </div>
      </div>
    </div>
  );
}
