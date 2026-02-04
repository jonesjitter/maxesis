import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MAXESIS Stream Overlay",
  description: "Stream overlay for OBS",
};

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
