"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function PCComponent({ className }: { className?: string }) {
    return (
        <nav className={`flex items-center justify-between border-b border-gray-200 px-4 py-2 ${className ?? ""}`}>
            {/* ロゴ＋タイトル */}
            <Link href="/" className="flex items-center space-x-2">
                <Image src="/seller.png" alt="Sellerロゴ" width={50} height={25} priority/>
                <span className="text-2xl font-bold text-blue-900">Seller</span>
            </Link>

            {/* メニュー */}
            <ul className="hidden md:flex space-x-6 text-blue-900 font-bold">
                <li><Link href="/logout">ログアウト</Link></li>
                <li><Link href="/private">商品一覧</Link></li>
                <li><Link href="/myPage">マイページ</Link></li>
                <li><Link href="/shopEdit">商品の編集</Link></li>
                <li><Link href="/stockInfo">在庫情報</Link></li>
            </ul>
        </nav>
    );
}