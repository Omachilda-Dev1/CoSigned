import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAddress, isAddress } from "viem";
import { shortAddress } from "@/lib/format";
import { ProfileView } from "./ProfileView";

type Props = { params: { address: string } };

export function generateMetadata({ params }: Props): Metadata {
  if (!isAddress(params.address)) return { title: "Profile" };
  return {
    title: `${shortAddress(params.address)} — credentials`,
    description: `Mentorship credentials co-signed on-chain by ${params.address}.`,
  };
}

export default function ProfilePage({ params }: Props) {
  if (!isAddress(params.address)) notFound();
  return <ProfileView address={getAddress(params.address)} />;
}
