"use client"
import { supabase } from "@/utils/supabase/supabase";
import "../globals.css"
import { signOut } from "../authSlice";
import { signIn } from "../authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import Google from "./google";
import X from "./x";
import { useRouter } from "next/navigation";
import Github from "./github"

export default function Shop() {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch()
  const [user, setUser] = useState("")//ログイン情報を保持するステート
  const [avatarUrl, setAvatarUrl] = useState<string>(""); // URLを保存する状態
  const router = useRouter();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event)
        if (session?.user) {
          setUser(session.user.email || "GitHub User")
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
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-24 sm:py-32">
        <h1 className="text-3xl font-bold text-center mb-10">ログイン画面</h1>
        <div className="flex flex-wrap justify-center gap-10">
          <Github />
          <Google />
          <X />
        </div>
      </div>

    </>
  )
}