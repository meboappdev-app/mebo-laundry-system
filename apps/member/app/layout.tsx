import "./globals.css";

export const metadata = {
  title: "Mebo Laundry Member",
  description:
    "Dashboard member Mebo Laundry"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
