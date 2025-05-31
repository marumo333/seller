"use client";

import { Translator } from '@/app/libs/deepl'
import { DeeplLanguages } from 'deepl'
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import QRcode from './QRcode';
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button"



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
  const auth = useSelector((state: any) => state.auth.isSignIn);
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

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) setUserId(data.user.id);
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

  //stripe checkout
  const startCheckout = async () => {
    if (!imageDetail || !userId) return;

    try {
      const response = await fetch(
        `/image/${imageDetail.id}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: imageDetail.id,
            name: imageDetail.name,
            price: Math.round(Number(imageDetail.price)),
            userId: userId,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData && responseData.checkout_url) {
        sessionStorage.setItem("stripeSessionId", responseData.session_id);
        router.push(responseData.checkout_url);
      } else {
        console.error("Invalid response data:", responseData);
      }
    } catch (err) {
      console.error("Error in startCheckout:", err);
    }
  };


  const handlePurchaseConfirm = () => {
    if (!auth) {
      setShow(false);
      router.push("/login");
    } else {
      //Stripe購入画面へ。
      startCheckout();
    }
  };

  const handleOpen = () => {
    setShow(true);
  };


  const handleBack = () => {
    router.back();
  };


  const handleCancel = () => {
    setShow(false);
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-8">
      {/* 翻訳 */}
      <div className="space-y-2">
        <button
          onClick={() => clickTranslate('EN-US')}
          className="btn-success"
        >
          Translate to English
        </button>
        <div className="p-4 bg-gray-100 rounded-md border text-gray-700 whitespace-pre-wrap">
          <strong>Translation result:</strong><br />
          {translate || "ここに翻訳結果が表示されます"}
        </div>
      </div>
      {/* タイトル */}
      <h1 className="text-3xl font-bold text-blue-800 border-b pb-2">
        商品名: {imageDetail.name}
      </h1>

      {/* 商品情報 */}
      <div className="grid grid-cols-1 gap-4 text-gray-700">
        <Item label="JANコード" value={imageDetail.jan || "（なし）"} />
        <Item label="商品名" value={imageDetail.name || "（なし）"} />
        <Item label="商品詳細" value={imageDetail.content || "（なし）"} />
        <Item label="ターゲット層" value={imageDetail.tag || "（なし）"} />
        <Item label="在庫数" value={imageDetail.stock ?? "（なし）"} />
        <Item label="価格" value={imageDetail.price ?? "（なし）"} />
      </div>

      {/* 画像 */}
      <div className="flex justify-center">
        <img
          src={imageDetail.url}
          alt={imageDetail.name}
          className="object-contain w-full max-w-md rounded-lg border shadow-md"
        />
      </div>

      {/* ボタン */}
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={imageDetail.url}
          download={imageDetail.name}
          className="btn-primary"
        >
          ダウンロード
        </a>
        <button onClick={handleBack} className="btn-secondary">
          戻る
        </button>
        <button onClick={handleOpen} className="btn-warning">
          購入する
        </button>
        <Link
          href={`/image/${encodeURIComponent(imageDetail.id)}/shopEdit`}
          className={buttonVariants({ variant: "outline" })}
        >
          商品情報を更新
        </Link>

      </div>

      {/* 購入モーダル */}
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 text-center">
            <h3 className="text-xl font-semibold">この商品を購入しますか？</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancel} className="btn-secondary">
                キャンセル
              </button>
              <button onClick={handlePurchaseConfirm} className="btn-success">
                購入する
              </button>
            </div>
          </div>
        </div>
      )}
      {/* QRコード */}
      <div className="flex justify-center">
        <div className="border p-4 rounded-md shadow-md">
          <QRcode url={`https://seller-weld.vercel.app/image/${encodeURIComponent(imageDetail.id)}`} />
        </div>
      </div>
    </div>
  );
}

// コンポーネント：項目
function Item({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-lg">
      <strong>{label}：</strong>
      <span className="ml-2">{value}</span>
    </div>
  );
}
