"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch} from "react-redux";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";
import { signIn, signOut } from "./authSlice";

export default function Index() {
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート
  const router = useRouter();
  useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log(event)
          if (session?.user) {
            setUser(session.user.email || "Login User")
            dispatch(signIn({
              name: session.user.email,
              iconUrl: "",
              token: session.provider_token
            }))
            window.localStorage.setItem('oauth_provider_token', session.provider_token || "");
            window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token || "")
          }
  
          if (event === 'SIGNED_OUT') {
            window.localStorage.removeItem('oauth_provider_token')
            window.localStorage.removeItem('oauth_provider_refresh_token')
            setUser("")//user情報をリセット
            dispatch(signOut());
          }
        }
      );
      //クリーンアップ処理追加（リスナー削除）
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }, [dispatch]);
  
    useEffect(() => {
      if (user) {
        router.push("/private")
      }
    }, [user, router])
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      {/* ロゴ背景 */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 z-0 pointer-events-none">
        <Image
          src="/seller.png"
          alt="logo"
          width={600}
          height={600}
          className="w-[300px] sm:w-[400px] lg:w-[500px] object-contain"
          priority
        />
      </div>

      {/* 本文コンテンツ */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 bg-white/60 backdrop-blur-sm rounded-xl p-10 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-blue-900">
          商品管理アプリ  『Seller』
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed">
          このアプリは、商品のプライスの修正・刷新等の商品管理ができます。
          <br />
          修正内容をQRコードに変換し、実店舗等で活用できます。
        </p>

        <p className="text-md text-gray-800 font-medium">下記からログインしてね 👇</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Link
            href="/Home"
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition"
          >
            ログイン（販売者用）
          </Link>
        </div>
      </div>
    </div>
  );
}
