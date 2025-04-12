import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/supabase";

interface shopStock {
    id: number,
    name: string,
    stock: number,
    JAN: string,
    price: number,
}

export default function StockInfo() {
    const [shops, setShops] = useState<shopStock[]>([])
    const [loading, setLoading] = useState(false)
        
    useEffect(()=>{
        getStockData();
    },[])
        const getStockData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("shopPosts")
                .select("id,name,stock,JAN,price")

            if (error) {
                console.error("商品の在庫情報を取得できませんでした。", error)
            }
            const formattedData: shopStock[] = (data || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                stock: item.stock,
                JAN: item.JAN,
                price: item.price
            }));
            setShops(formattedData)
            setLoading(false)
        }

        

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }
    return (
        <>
            <div className="relative">
            <h1 className="fixed top-0 right-0 left-0">商品検索・商品在庫数検索</h1>
        {shops.map((item) => (
          <><strong key={item.id}></strong><p>在庫数:{item.stock}</p>
          <p>JANコード:{item.JAN}</p>
          <p>商品名：{item.name}</p>
          <p>価格:{item.price}</p>
          </>
        ))}
      </div>

        </>
    )
}