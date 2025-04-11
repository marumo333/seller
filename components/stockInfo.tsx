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



    return(
        <>
        <h1>商品検索・商品在庫数検索</h1>
        </>
    )
}