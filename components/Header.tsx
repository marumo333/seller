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
        <nav className="flex">
            <h1>Seller</h1>

            {/* ロゴ */}
            <div className="flex-none sm:flex-1 md:flex-1 lg:flex-1 xl:flex-1">
                <Link href="/">
                    <Image src="/images/logo.png" alt="logo" width={200} height={100} />
                </Link>
            </div>

            {/* メニューリスト */}
            <div className="flex-initial text-[#abc5c5] font-bold m-5">
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
