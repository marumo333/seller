"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import Link from "next/link";

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

export default function PrivateImage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("shopposts").select("*");

    if (error) {
      console.error("画像取得エラー:", error);
      setLoading(false);
      return;
    }

    const formattedData = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.image_url,
      jan: item.jan,
      content: item.content,
      tag: item.tag,
      stock: item.stock,
      price: item.price,
    }));

    setImages(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      <ul className="flex flex-wrap w-full">
        {images.map((item) => (
          <li key={item.id} className="w-1/4 p-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img className="object-cover max-h-32 w-full" src={item.url} alt={item.name} />
            </a>
            <Link href={`/image/${item.id}`}>
              <span className="text-blue-500 underline">詳細を見る</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
