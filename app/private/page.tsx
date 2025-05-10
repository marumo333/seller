"use client";
import PrivateImage from "./privateImage";
import React from "react";
import { useState, useEffect } from "react";

export default function Private() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <h1>読み込み中....</h1>;
  }
  return (
    <>
      <>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              商品一覧
            </h1>
            <p className="mb-4">
              *表示された画像は5分でリンクが不可になります。
              <br />
              再度アクサスした場合はリロードボタンを押してください。
            </p>
            <div className="flex-1 w-full flex flex-col items-center">
              <PrivateImage />
            </div>
          </div>
        </div>
      </>
    </>
  );
}
