"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    list: {
        name: string;
        link: string;
    }[];
}
export default function Header({ list }: HeaderProps) {
    return (
        <nav className="flex border-b border-gray-200">
            <h1 className="text-2xl/7 font-bold text-blue-900 sm:truncate sm:text-3xl sm:tracking-tight ">Seller</h1>

            {/* ロゴ */}
            <div className="flex-none sm:flex-1 md:flex-1 lg:flex-1 xl:flex-1 ">
                <Link href="/">
                    <Image src="/seller.png" alt="logo" width={50} height={25} />
                </Link>
            </div>
            {/* メニューリスト */}
            <div className="flex-initial text-blue-900 font-bold m-5 ">
                <ul className="md:flex hidden flex-initial text-left">
                    {list.map((value, index) => (
                        <li key={index} className="p-4">
                            <a href={value.link}>{value.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
