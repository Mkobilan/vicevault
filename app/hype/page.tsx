import type { Metadata } from "next";
import { HypeClient } from "./HypeClient";

export const metadata: Metadata = {
  title: "Fan Workshop | GTA 6 Meme Generator & Story Builder",
  description: "Use Vice Vault fan tools to build your own GTA 6 story, generate custom Vice City memes, and participate in community polls about the future of Leonida.",
};

export default function HypePage() {
  return <HypeClient />;
}
