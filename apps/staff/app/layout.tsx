import "./globals.css";

export const metadata = {
  title: "Mebo Laundry Staff"
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
