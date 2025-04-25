"use client"
import PrivateImage from "./privateImage";
import React from "react";
import { useState, useEffect } from "react";

export default function Private() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])
    if (!isClient) {
        return <h1>読み込み中....</h1>
    }
    return (
        <>

            <>
                <h1 className="relative inline-block px-[55px]">
                    商品一覧
                </h1>

                <p className="mb-4">
                    *表示された画像は5分でリンクが不可になります。<br />
                    再度アクサスした場合はリロードボタンを押してください。
                </p>
                <div className="flex-1 w-full flex flex-col items-center">
                    <PrivateImage />
                </div>
            </>

        </>
    )
}
