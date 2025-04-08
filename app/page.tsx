"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Index() {
  return (
    <div className="relative min-h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* ロゴ背景 */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 z-0">
        <Image
          src="/seller.png"
          alt="logo"
          width={600}
          height={600}
          className="w-[300px] sm:w-[400px] lg:w-[500px] object-contain"
        />
      </div>

      {/* 本文コンテンツ */}
      <div className="relative z-10 text-center space-y-6">
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
    </div>
  )
}
