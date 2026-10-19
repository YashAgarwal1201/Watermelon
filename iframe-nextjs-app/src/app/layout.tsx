// File: iframe-nextjs-app/src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics & Telemetry Dashboard (Next.js 16 Iframe)",
  description: "Next.js 16 App Router microfrontend remote running in an isolated iframe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
