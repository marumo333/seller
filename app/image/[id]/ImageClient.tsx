"use client";

import { Translator } from '@/libs/deepl'
import { DeeplLanguages } from 'deepl'
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import QRcode from './QRcode';
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface ImageItem {
  id: string;
  name: string;
  url: string;
  jan: number;
  content: string;
  tag: string;
  stock: number;
  price: number;
}

export default function ImageClient({ id }: { id: string }) {
  const [imageDetail, setImageDetail] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [translate, setTranslate] = useState<string>("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  const fetchImage = async (imageId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shopposts")
      .select("id,url,name, image_url, content,tag,stock,price,jan")
      .eq("id", imageId)
      .single();

    if (error || !data) {
      console.error("画像取得エラー:", error.message);
      setLoading(false);
      return;
    }
    setImageDetail({
      id: data.id,
      name: data.name,
      url: data.image_url,
      jan: data.jan,
      content: data.content,
      tag: data.tag,
      stock: data.stock,
      price: data.price,
    });

    setLoading(false);
  };

  function clickTranslate(my_target_lang: DeeplLanguages) {
    if (!imageDetail) return;
    const textToTranslate = `
     商品名：${imageDetail.name}
     商品詳細：${imageDetail.content}
     ターゲット層：${imageDetail.tag}
     在庫数：${imageDetail.stock}
     価格：${imageDetail.price}
    `;
    Translator(textToTranslate, my_target_lang).then((result) => {
      setTranslate(result.text);
    });
  }

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) setUserId(data.user.id);
  };

  useEffect(() => {
    fetchImage(id);
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!imageDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-500">画像が見つかりません。</span>
      </div>
    );
  }
  const handleOpen = () => {
    setShow(true);
  };
  const handleBack = () => {
    router.back()
  }
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b pb-2">
        商品名: {imageDetail.name}
      </h1>

      {/* 商品情報セクション */}
      <div className="space-y-4 text-gray-800">
        <div className="text-lg">
          <strong>JANコード：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.jan || "（なし）"}</span>
        </div>
        <div className="text-lg">
          <strong>商品名：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.name || "（なし）"}</span>
        </div>
        <div className="text-lg">
          <strong>商品詳細：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.content || "（なし）"}</span>
        </div>
        <div className="text-lg">
          <strong>ターゲット層：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.tag || "（なし）"}</span>
        </div>
        <div className="text-lg">
          <strong>在庫数：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.stock ?? "（なし）"}</span>
        </div>
        <div className="text-lg">
          <strong>価格：</strong>
          <span className="ml-2 text-gray-600">{imageDetail.price ?? "（なし）"}</span>
        </div>
      </div>

      {/* 画像表示 */}
      <div className="my-6">
        <img
          src={imageDetail.url}
          alt={imageDetail.name}
          className="object-contain w-full max-h-[400px] rounded-lg border border-gray-200 shadow"
        />
      </div>

      {/* 操作ボタンエリア */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <a
          href={imageDetail.url}
          download={imageDetail.name}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow"
        >
          ダウンロード
        </a>
        <a >
          <Link href="/shopEdit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow">
            商品情報を編集(管理者のみ可能)
          </Link>
        </a>
        <button
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 text-lg"
        >
          戻る
        </button>
        <button
          onClick={handleOpen}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded text-lg"
        >
          購入する
        </button>
      </div>

      <div className="my-4">
        <button
          onClick={() => clickTranslate('EN-US')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow"
        >
          Translate English
        </button>
        <div className="mt-3 p-4 bg-gray-100 border border-gray-300 rounded-md whitespace-pre-wrap text-gray-800">
          <strong>Translation result:</strong><br />
          {translate || "ここに翻訳結果が表示されます"}
        </div>
      </div>


      {/* QRコード */}
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="md:w-1/2 flex items-center justify-center border p-4 rounded-md shadow">
          <QRcode url={`https://seller-weld.vercel.app/image/${encodeURIComponent(imageDetail.id)}`} />
        </div>
      </div>
    </div>
  );
}
