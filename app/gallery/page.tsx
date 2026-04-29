import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Visual Archive | Leonida Gallery & Postcards",
  description: "Explore the stunning visual archive of Leonida. A curated collection of official GTA 6 artworks, character postcards, and community captures from Vice City.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
