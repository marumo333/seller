import React from "react";
import {useState,useEffect} from "react";
import { supabase } from "@/utils/supabase/supabase";

interface shopStock{
    id:number,
    name:string,
    stock:number,
    JAN:string,
    price:number,
}

export default function StockInfo(){
    const [shop,setShop] = useState<shopStock[]>([])
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        setLoading(true);
        const getStockData = async()=>{
            const {data,error} = await supabase
            .from("shopPosts")
            .select("id,name,stock,JAN,price")

            if(error){
                console.error("商品の在庫情報を取得できませんでした。",error)
            }
            setShop(data)
        }
        setLoading(false)
    },[])

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        );
      }
    return(
        <>
        <h1>商品検索・商品在庫数検索</h1>
        </>
    )
}