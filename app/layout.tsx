import Header from "@/components/Header";
import "./globals.css";
import React from "react";
import ClientWrapper from "./clientWrapper";

const defaultURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: defaultURL ? new URL(defaultURL) : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const menuList=[
    {name:'myPage',link:'#myPage'},
    {
      name:'shopEdit',
      link:'#shopEdit'
    },{
      name:'stockInfo',
      link:'#stockInfo'
    },{
      name:'shopPost',
      link:'shopPost'
    }
  ]
  return (
    <html lang="ja">
      <body className="bg-background text-foreground">
        <Header list={menuList}/>
        <main className="min-h-screen flex flex-col items-center px2">
          <myPage/>
          <shopEdit/>
          <stockInfo/>
          <shopPost/>
          {/* ClientWrapperを使用してクライアント側のロジックを分離 */}
          <ClientWrapper>{children}</ClientWrapper>
        </main>
      </body>
    </html>
  );
}

