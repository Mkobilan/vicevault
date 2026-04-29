import type { Metadata } from "next";
import { VaultClient } from "./VaultClient";

export const metadata: Metadata = {
  title: "Vault Dashboard",
  description: "Your central hub for GTA 6. Track the launch countdown, access the interactive Leonida map, and see the latest community highlights from the Vice Vault.",
};

export default function DashboardPage() {
  return <VaultClient />;
}
