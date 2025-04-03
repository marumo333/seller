"use client"
import React from "react";
import {useState,useEffect} from "react";
import Link from "next/link";

export default function Index(){
  return(
    <>
    <h1>商品管理アプリ</h1>
    <p>このアプリは、商品のプライスの修正・刷新等の商品管理</p>
    <p>商品の修正ページを作成し、修正したものをQRコードに変換できるツールです。</p>
    <a>下記からログインしてね</a>
    <Link href="Home">ログインはこちら</Link>
    </>
  )
}