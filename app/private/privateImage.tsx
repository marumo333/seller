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

      <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {images.map((item) => (
          <li
            key={item.id}
            className="group relative bg-white rounded-md shadow p-2"
          >
            <Link href={`/image/${item.id}`} className="block">
              <img
                src={item.url}
                alt={item.name}
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              />
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-700 font-semibold">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.tag}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
