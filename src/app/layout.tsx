import "./globals.css";
import TRPCProvider from "@/app/trpc/trpc-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BTC Management",
  description: "Admin dashboard for Bitcoin fund management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
