import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mebo Laundry",
  description: "Mebo Laundry Management System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
