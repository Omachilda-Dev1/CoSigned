import type { Metadata } from "next";
import { CreateBondForm } from "./CreateBondForm";

export const metadata: Metadata = {
  title: "Create a bond",
  description: "Define a skill, success criteria and deadline. Your learner accepts on-chain.",
};

export default function CreateBondPage() {
  return <CreateBondForm />;
}
