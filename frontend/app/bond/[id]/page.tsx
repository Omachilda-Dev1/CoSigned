import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BondView } from "./BondView";

type Props = { params: { id: string } };

const isBondId = (id: string) => /^[1-9]\d{0,17}$/.test(id);

export function generateMetadata({ params }: Props): Metadata {
  return { title: `Bond #${params.id}` };
}

export default function BondPage({ params }: Props) {
  if (!isBondId(params.id)) notFound();
  return <BondView bondId={params.id} />;
}
