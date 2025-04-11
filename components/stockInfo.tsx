import React from "react";
import {useState,useEffect} from "react";

interface shopStock{
    id:number,
    name:string,
    stock:number,
    JAN:string,
    price:number,
}

export default function StockInfo(){
    return(
        <>
        <h1>商品検索・商品在庫数検索</h1>
        </>
    )
}