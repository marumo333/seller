import "./globals.css";
import React from "react";
import Header from "@/app/components/Header";
import ClientWrapper from "./clientWrapper";
import Providers from "./provider";

const defaultURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: defaultURL ? new URL(defaultURL) : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <html lang="ja">
      <body>
        <Providers>
          <Header>
        <main className="min-h-screen flex flex-col items-center px-2">
        <ClientWrapper>{children}</ClientWrapper>
        </main>
        </Header>
        </Providers>
      </body>
    </html>
  );
}
