import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "畑 | 圃場状態共有アプリ",
  description: "農業チームのための圃場状態共有アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
