"use client"
import React from "react";
import Link from "next/link";
export default function Index() {
  return (
    <>
      <div className="p-6 space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight text-blue-900 sm:text-7xl">
          商品管理アプリ: Seller
        </h1>

        <p>このアプリは、商品のプライスの修正・刷新等の商品管理</p>
        <p>商品の修正ページを作成し、修正したものをQRコードに変換できるツールです。</p>

        <p className="text-lg">下記からログインしてね 👇</p>

        <Link
          href="/Home"
          className="text-red-600 underline underline-offset-2 hover:text-red-800 transition"
        >
          ログインはこちら
        </Link>
      </div>
    </>
  )
}