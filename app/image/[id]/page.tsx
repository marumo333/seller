"use client";

import React, { useEffect, useState, use } from "react";
import { supabase } from "@/utils/supabase/supabase";


interface ImageItem {
    id: string;
    name: string;
    url: string;
    jan: number;
    content: string;
    tag: string,
    stock: number,
    price: number,
}

export default function Image({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [imageDetail, setImageDetail] = useState<ImageItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");

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
    })

    setLoading(false);
  };


  const handleDelete = async () => {
    if (!imageDetail) return;
    try {
      const filePath = imageDetail.url.replace(
        `https://tkkavdiinrmmeeghllrr.supabase.co/storage/v1/object/public/outfit_image/`,
        ""
      );
      const { error: deleteError } = await supabase.storage
        .from("posts")
        .remove([filePath])

      if (deleteError) throw new Error(`削除エラー${deleteError.message}`)

      const { error: dbError } = await supabase
        .from("posts")
        .delete()
        .eq("id", imageDetail.id);

      if (dbError) throw new Error(`データベース削除エラー:${dbError.message}`)

      alert("画像を削除しました")
      setImageDetail(null);
    } catch (error: any) {
      alert(error.message);
    }
  }

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      setUserId(data.user.id);
    }
  };
  useEffect(() => {
    if (resolvedParams.id) {
      fetchImage(resolvedParams.id);
      fetchUser();
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchImage(resolvedParams.id);
    }
  }, [resolvedParams.id])

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

  return (
    <div className="p-4">
      {imageDetail ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              商品名: {imageDetail.name}
            </h1>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              JANコード：
              <span className="font-normal text-gray-700">{imageDetail.jan || "（なし）"}</span>
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              商品名：
              <span className="font-normal text-gray-700">{imageDetail.name || "（なし）"}</span>
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              商品の詳細：
              <span className="font-normal">{imageDetail.content || "（なし）"}</span>
            </p>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              ターゲット層：
              <span className="font-normal text-gray-700">{imageDetail.tag || "（なし）"}</span>
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              在庫数：
              <span className="font-normal">{imageDetail.stock || "（なし）"}</span>
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              価格：
              <span className="font-normal">{imageDetail.price || "（なし）"}</span>
            </p>
          </div>
          <div className="mb-6">
            <img
              src={imageDetail.url}
              alt={imageDetail.name}
              className="object-contain max-w-full max-h-[400px] rounded-lg shadow-md"
            />
          </div>
          <div className="flex justify-center gap-4">
            <a
              href={imageDetail.url}
              download={imageDetail.name}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md"
            >
              ダウンロード
            </a>
            <button
              onClick={handleDelete}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md"
            >
              投稿の削除
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">画像の詳細を取得できませんでした。</p>
      )}
    </div>


  );
}


