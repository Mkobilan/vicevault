import type { Metadata } from "next";
import { ChatClient } from "./ChatClient";

export const metadata: Metadata = {
  title: "Global Frequency",
  description: "Join the live GTA 6 fan community chat. Discuss theories, share findings, and connect with other Leonida citizens in real-time.",
};

export default function ChatPage() {
  return <ChatClient />;
}
