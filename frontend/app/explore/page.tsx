import type { Metadata } from "next";
import { Explore } from "./Explore";

export const metadata: Metadata = {
  title: "Explore bonds",
  description: "Every mentorship bond on CoSigned — public and verifiable on Base.",
};

export default function ExplorePage() {
  return <Explore />;
}
