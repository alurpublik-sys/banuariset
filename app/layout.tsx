import type { Metadata } from "next";
import "./globals.css";
import "./fixes.css";

export const metadata: Metadata = {
  title: "Banua Research — Research & Policy Knowledge Hub",
  description: "Banua Research adalah platform riset, kebijakan, dan pengetahuan regional berbasis Sulawesi Tengah.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
