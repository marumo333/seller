"use client"
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";
import Link from "next/link";

interface shopStock {
    id: number,
    name: string,
    stock: number,
    jan: string,
    price: number,
}

export default function StockInfo() {
    const [shops, setShops] = useState<shopStock[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getStockData();
    }, []);

    const getStockData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("shopposts")
            .select("id,name,stock,jan,price");

        if (error) {
            console.error("商品の在庫情報を取得できませんでした。", error)
        }

        const formattedData: shopStock[] = (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            stock: item.stock,
            jan: item.jan,
            price: item.price
        }));
        setShops(formattedData);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                商品在庫
            </h1>
            <Link href="/search" className="flex justify-center items-center w-[300px] h-[60px] text-[#333] text-lg font-bold bg-[#7dca65] rounded-[20px] border-2 border-[#325328] no-underline">
                商品を検索
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
                        <p className="text-sm text-gray-500">JANコード: {item.jan}</p>
                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                        <p className="text-blue-600 font-medium">価格: ¥{item.price}</p>
                        <p className="text-green-600 font-medium">在庫数: {item.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
