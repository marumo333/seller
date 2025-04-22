"use client";
import { Translator } from '@/libs/deepl'
import { DeeplLanguages } from 'deepl'
import React, { useEffect, useState, use } from "react";
import { supabase } from "@/utils/supabase/supabase";
import ShopEdit from "./shopEdit"
import QRCode from "./QRcode";

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
  const [translate, setTranslate] = useState<string>("");


  //翻訳機能を追加
  function clickTranslate(my_text: string, my_target_lang: DeeplLanguages) {
    const translations = Translator(my_text, my_target_lang)
    translations.then((result) => setTranslate(imageDetail||""))
  }


  const handleDelete = async () => {
    if (!imageDetail) return;
    try {
      const filePath = imageDetail.url.replace(
        `https://tkkavdiinrmmeeghllrr.supabase.co/storage/v1/object/public/shopposts/`,
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
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md shadow"
        >
          商品情報の削除
        </button>
      </div>
      <button onClick={() => clickTranslate(translate, 'EN-US')}>Translate English</button><br /><br />
      <p className="mt-2 text-gray-700 whitespace-pre-wrap">
        翻訳結果: {translate}
      </p>

      {/* QRコード & 編集フォーム */}
      <div className="mt-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="md:w-1/2 flex items-center justify-center border p-4 rounded-md shadow">
          <QRCode url={`http://localhost:3000/app/image/${encodeURIComponent(imageDetail.id)}`} />
        </div>
        <div className="md:w-1/2">
          <ShopEdit id={imageDetail.id} />
        </div>
      </div>
    </div>

  );
}


