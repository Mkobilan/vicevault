import type { Metadata } from "next";
import { FeedClient } from "./FeedClient";

export const metadata: Metadata = {
  title: "The Wire | Live GTA 6 News & Community Intel",
  description: "Stay updated with 'The Wire'—your live frequency for GTA 6 news, community posts, and the latest intel from around the state of Leonida.",
};

export default function FeedPage() {
  return <FeedClient />;
}
